import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { backPostSchema } from "~/utils/schema";

export const postRouter = createTRPCRouter({
    create: privateProcedure
        .input(backPostSchema)
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            const post = await ctx.prisma.post.create({
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

            return post;
        }),
});
