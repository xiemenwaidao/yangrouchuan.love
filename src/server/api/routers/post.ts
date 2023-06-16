import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { postSchema } from "~/utils/schema";

export const postRouter = createTRPCRouter({
    create: privateProcedure
        .input(postSchema)
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            const post = await ctx.prisma.post.create({
                data: {
                    authorId,
                    rating: input.rating,
                    content: input.content,
                    price: input.price,
                    placeId: input.placeId,
                },
            });

            return post;
        }),
});
