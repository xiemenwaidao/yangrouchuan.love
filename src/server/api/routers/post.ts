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
                    updatedAt: "desc",
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
                    orderBy: [{ updatedAt: "desc" }],
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
                    orderBy: [{ updatedAt: "desc" }],
                })
                .then(addUserDataToPosts);
        }),

    store: privateProcedure
        .input(backPostSchema)
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            // TODO: limitter入れる（upstash）

            const postWithImages = await ctx.prisma.$transaction(
                async (prisma) => {
                    const post = await prisma.post.upsert({
                        where: {
                            // ユーザーと場所の組み合わせが一意になるようにする
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
                            skewerCount:
                                input.skewerCount !== undefined
                                    ? input.skewerCount
                                    : null,
                        },
                        create: {
                            authorId,
                            rating: input.rating,
                            content: input.content,
                            price: input.price,
                            skewerCount: input.skewerCount,
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

                    // Get existing images
                    const existingImages = await ctx.prisma.image.findMany({
                        where: {
                            postId: post.id,
                        },
                    });

                    // Extract image ids from existingImages
                    const existingImageIds = existingImages.map(
                        (image) => image.id
                    );
                    // Extract image ids from input.images
                    const inputImageIds = input.images;

                    // Determine images to be deleted (existing in DB but not in the input)
                    const imagesToDelete = existingImageIds.filter(
                        (id) => !inputImageIds.includes(id)
                    );

                    // Determine images to be created (existing in the input but not in the DB)
                    const imagesToCreate = inputImageIds.filter(
                        (id) => !existingImageIds.includes(id)
                    );

                    // Delete images
                    if (imagesToDelete.length > 0) {
                        await prisma.image.deleteMany({
                            where: {
                                id: {
                                    in: imagesToDelete,
                                },
                            },
                        });
                    }

                    if (imagesToCreate.length > 0) {
                        // Create images
                        await prisma.image.createMany({
                            data: imagesToCreate.map((imageId) => ({
                                id: imageId,
                                postId: post.id,
                            })),
                        });
                    }

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
