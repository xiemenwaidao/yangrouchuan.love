import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { request } from "undici";
import { env } from "~/env.mjs";
import { z } from "zod";
import {
    type DeleteResponse,
    type DirectCreatorUploadResponse,
} from "~/utils/types";

export const cloudflareImagesRouter = createTRPCRouter({
    getUploadImageURL: privateProcedure.mutation(async () => {
        const { statusCode, body } = await request(
            `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_CLOUDFLARE_ACCOUNT_ID}/images/v1/direct_upload`,
            {
                method: "POST",
                headers: {
                    authorization: `Bearer ${env.NEXT_CLOUDFLARE_IMAGES_API_TOKEN}`,
                },
            }
        );

        if (statusCode !== 200) throw new Error(await body.text());

        const json = (await body.json()) as DirectCreatorUploadResponse;

        return json.result.uploadURL;
    }),
    getManyUploadImageURL: privateProcedure
        .input(
            z.object({
                count: z.number().int().min(0).max(10),
            })
        )
        .mutation(async ({ input }) => {
            const promises = Array.from({ length: input.count }, async () => {
                const { statusCode, body } = await request(
                    `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_CLOUDFLARE_ACCOUNT_ID}/images/v1/direct_upload`,
                    {
                        method: "POST",
                        headers: {
                            authorization: `Bearer ${env.NEXT_CLOUDFLARE_IMAGES_API_TOKEN}`,
                        },
                    }
                );

                if (statusCode !== 200) throw new Error(await body.text());

                const json = (await body.json()) as DirectCreatorUploadResponse;
                return json.result;
            });

            const results = await Promise.all(promises);
            return results;
        }),
    deleteImage: privateProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { statusCode, body } = await request(
                `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_CLOUDFLARE_ACCOUNT_ID}/images/v1/${input.id}`,
                {
                    method: "DELETE",
                    headers: {
                        authorization: `Bearer ${env.NEXT_CLOUDFLARE_IMAGES_API_TOKEN}`,
                    },
                }
            );

            if (statusCode !== 200) throw new Error(await body.text());

            const json = (await body.json()) as DeleteResponse;
            return json;
        }),
    deleteImages: privateProcedure
        .input(z.array(z.string()))
        .mutation(async ({ input }) => {
            const promises = input.map(async (id) => {
                const { statusCode, body } = await request(
                    `https://api.cloudflare.com/client/v4/accounts/${env.NEXT_CLOUDFLARE_ACCOUNT_ID}/images/v1/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            authorization: `Bearer ${env.NEXT_CLOUDFLARE_IMAGES_API_TOKEN}`,
                        },
                    }
                );

                if (statusCode !== 200) throw new Error(await body.text());

                const json = (await body.json()) as DeleteResponse;
                return json;
            });

            const results = await Promise.all(promises);
            return results;
        }),
});
