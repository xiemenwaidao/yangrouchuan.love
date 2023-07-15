import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { addUserDataToPosts } from "~/server/helpers/addUserDataToPosts";
import { backPostSchema } from "~/utils/schema";

export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            include: {
                place: true,
                images: true,
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        });

        return addUserDataToPosts(posts);
    }),

    getById: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const post = await ctx.prisma.post.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    place: true, // Placeテーブルのデータを含める
                    images: true, // Imageテーブルのデータを含める
                },
            });

            if (!post)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Post not found",
                });

            return (await addUserDataToPosts([post]))[0];
        }),

    getPostsByUserId: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            })
        )
        .query(({ ctx, input }) =>
            ctx.prisma.post
                .findMany({
                    where: {
                        authorId: input.userId,
                    },
                    include: {
                        place: true,
                        images: true,
                    },
                    take: 100,
                    orderBy: [{ createdAt: "desc" }],
                })
                .then(addUserDataToPosts)
        ),

    getPostsByUsername: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const [user] = await clerkClient.users.getUserList({
                username: [input.username],
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            return ctx.prisma.post
                .findMany({
                    where: {
                        authorId: user.id,
                    },
                    include: {
                        place: true,
                        images: true,
                    },
                    take: 100,
                    orderBy: [{ createdAt: "desc" }],
                })
                .then(addUserDataToPosts);
        }),

    store: privateProcedure
        .input(backPostSchema)
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            // limitter入れる（upstash）

            const postWithImages = await ctx.prisma.$transaction(
                async (prisma) => {
                    const post = await prisma.post.upsert({
                        where: {
                            authorId_placeId: {
                                authorId: authorId,
                                placeId: input.place.place_id,
                            },
                        },
                        update: {
                            rating: input.rating,
                            content: input.content,
                            price:
                                input.price !== undefined ? input.price : null,
                        },
                        create: {
                            authorId,
                            rating: input.rating,
                            content: input.content,
                            price: input.price,
                            place: {
                                connectOrCreate: {
                                    create: {
                                        id: input.place.place_id,
                                        title: input.place.title,
                                        address: input.place.address,
                                        lat: input.place.lat,
                                        lng: input.place.lng,
                                    },
                                    where: {
                                        id: input.place.place_id,
                                    },
                                },
                            },
                        },
                    });

                    // Delete all images associated with the post
                    await prisma.image.deleteMany({
                        where: {
                            postId: post.id,
                        },
                    });

                    // Create new images
                    await prisma.image.createMany({
                        data: input.images.map((imageId) => ({
                            id: imageId,
                            postId: post.id,
                        })),
                    });

                    return { post };
                }
            );

            return postWithImages.post;
        }),

    delete: privateProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.$transaction(async (prisma) => {
                const authorId = ctx.userId;

                const post = await prisma.post.findUnique({
                    where: {
                        id: input.id,
                    },
                });

                if (!post) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "削除する投稿が見つかりませんでした。",
                    });
                }

                if (post.authorId !== authorId) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "投稿主以外は投稿を削除できません。",
                    });
                }

                // Firstly, delete images related to this post
                await prisma.image.deleteMany({
                    where: {
                        postId: input.id,
                    },
                });

                await prisma.post.delete({
                    where: {
                        id: input.id,
                    },
                });
            });
        }),
});
