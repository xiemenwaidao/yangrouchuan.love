import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { request } from "undici";
import { env } from "~/env.mjs";
import { z } from "zod";

interface DirectCreatorUploadResponse {
    result: {
        id: string;
        uploadURL: string;
    };
    errors: {
        code: number;
        message: string;
    }[];
    messages: {
        code: number;
        message: string;
    }[];
    success: boolean;
}

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
                count: z.number().int().min(1).max(10),
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
                return json.result.uploadURL;
            });

            const urls = await Promise.all(promises);
            return urls;
        }),
    deleteImage: privateProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            //
        }),
});
