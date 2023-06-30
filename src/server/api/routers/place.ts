import { type Place, type Image } from "@prisma/client";
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

export const placeRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const places = await ctx.prisma.place.findMany({
            take: 100,
            orderBy: [
                {
                    createdAt: "desc",
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
});
