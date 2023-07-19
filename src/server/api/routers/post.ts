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
import { request } from "undici";
import { env } from "~/env.mjs";
import { type DeleteResponse } from "~/utils/types";

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

                    // Create images
                    if (imagesToCreate.length > 0) {
                        // Create images
                        await prisma.image.createMany({
                            data: imagesToCreate.map((imageId) => ({
                                id: imageId,
                                postId: post.id,
                            })),
                        });
                    }

                    return {
                        post,
                        imagesToDelete,
                    };
                }
            );

            // Delete cludflare images after successful transaction
            const promises = postWithImages.imagesToDelete.map(async (id) => {
                const { body } = await request(
                    `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_CLOUDFLARE_ACCOUNT_ID}/images/v1/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            authorization: `Bearer ${env.NEXT_CLOUDFLARE_IMAGES_API_TOKEN}`,
                        },
                    }
                );

                // TODO: エラー吐いてもアレなので、エラーでlogを残すようにしようかな？
                // if (statusCode !== 200)
                //     throw new Error(await body.text());

                const json = (await body.json()) as DeleteResponse;
                return json;
            });

            await Promise.all(promises);

            return postWithImages.post;
        }),

    delete: privateProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            let imagesToDelete: string[] = [];
            let isPlaceDelete: string | null = null;

            await ctx.prisma.$transaction(async (prisma) => {
                const authorId = ctx.userId;

                const post = await prisma.post.findUnique({
                    where: {
                        id: input.id,
                    },
                    include: {
                        images: true,
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

                // delete後にcountを取得したら0になったので、一応事前に取得しておく仕様に変更
                const count = await prisma.post.count({
                    where: {
                        placeId: post.placeId,
                    },
                });

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

                // cloudflare images data
                imagesToDelete = post.images.map((image) => image.id);

                // この投稿がその場所の最後の投稿かどうか
                isPlaceDelete = count === 1 ? post.placeId : null;
            });

            if (isPlaceDelete) {
                await ctx.prisma.place.delete({
                    where: {
                        id: isPlaceDelete,
                    },
                });
            }

            // Delete cludflare images after successful transaction
            const promises = imagesToDelete.map(async (id) => {
                const { body } = await request(
                    `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_CLOUDFLARE_ACCOUNT_ID}/images/v1/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            authorization: `Bearer ${env.NEXT_CLOUDFLARE_IMAGES_API_TOKEN}`,
                        },
                    }
                );

                // TODO: エラー吐いてもアレなので、エラーでlogを残すようにしようかな？
                // if (statusCode !== 200)
                //     throw new Error(await body.text());

                const json = (await body.json()) as DeleteResponse;
                return json;
            });
            await Promise.all(promises);
        }),
});
