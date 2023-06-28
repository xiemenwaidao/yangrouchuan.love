import { clerkClient } from "@clerk/nextjs";
import { type Image, type Place, type Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { backPostSchema } from "~/utils/schema";

interface PostWithPlaceAndImages extends Post {
    place: Place;
    images: Image[];
}

const addUserDataToPosts = async (posts: PostWithPlaceAndImages[]) => {
    const users = (
        await clerkClient.users.getUserList({
            userId: posts.map((post) => post.authorId),
            limit: 100,
        })
    ).map(filterUserForClient);

    return posts.map((post) => {
        const author = users.find((user) => user.id === post.authorId);

        if (!author || !author.username)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Author for post not found",
            });

        return {
            post,
            author: {
                ...author,
                username: author.username,
            },
        };
    });
};

export const postRouter = createTRPCRouter({
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
