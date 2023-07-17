import { type Place, type Image } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { addUserDataToPosts } from "~/server/helpers/addUserDataToPosts";
import { type PostWithOthers } from "~/utils/types";

type PlaceWithPosts<AdditionalFields = Record<string, unknown>> = Place & {
    posts: PostWithOthers<AdditionalFields>[];
};

const addUserDataToPlaces = async (
    places: PlaceWithPosts<{ images: Image[] }>[]
) => {
    return Promise.all(
        places.map(async (place) => {
            return {
                ...place,
                posts: await addUserDataToPosts(place.posts),
            };
        })
    );
};

// imageの取得数が気になる
export const placeRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const places = await ctx.prisma.place.findMany({
            take: 100,
            orderBy: [
                {
                    updatedAt: "desc",
                },
            ],
            include: {
                posts: {
                    include: {
                        images: true,
                    },
                },
            },
        });

        return addUserDataToPlaces(places);
    }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const place = await ctx.prisma.place.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    posts: {
                        include: {
                            images: true,
                        },
                        orderBy: [
                            {
                                updatedAt: "desc",
                            },
                        ],
                    },
                },
            });

            if (!place)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Place not found",
                });

            return (await addUserDataToPlaces([place]))[0];
        }),
});
