import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
    create: privateProcedure
        .input(
            z.object({
                content: z.string(),
                price: z.number().min(0).max(100000).optional(),
                placeId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            const post = await ctx.prisma.post.create({
                data: {
                    authorId,
                    content: input.content,
                    price: input.price,
                    placeId: input.placeId,
                },
            });

            return post;
        }),
});
