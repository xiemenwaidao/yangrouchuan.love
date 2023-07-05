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
                    take: 100,
                    orderBy: [{ createdAt: "desc" }],
                })
                .then(addUserDataToPosts)
        ),

    store: privateProcedure
        .input(backPostSchema)
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            // limitter入れる（upstash）

            const postWithImages = await ctx.prisma.$transaction(
                async (prisma) => {
                    // Create the post first
                    const post = await prisma.post.create({
                        data: {
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
                                    },
                                    where: {
                                        id: input.place.place_id,
                                    },
                                },
                            },
                        },
                    });

                    // Then create the images with the newly created post id
                    const images = await prisma.image.createMany({
                        data: input.images.map((imageId) => ({
                            id: imageId,
                            postId: post.id,
                        })),
                    });

                    return { post, images };
                }
            );

            return postWithImages.post;
        }),

    // update: privateProcedure.input(backPostSchema).mutation(),
    // delete: privateProcedure.input(z.object({
    //     id: string()
    // })).mutation(),
});
