import { IMAGE_PREFIX } from "~/config";
import { env } from "~/env.mjs";

interface ImageResponse {
    result: {
        filename: string;
        id: string;
        meta: {
            key: string;
        };
        requireSignedURLs: boolean;
        uploaded: string;
        variants: string[];
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

export const uploadImage = async (file: File, url: string, id: string) => {
    const form = new FormData();
    const ext = file.name.split(".").slice(-1)[0];

    if (!ext) throw new Error("Invalid file extension");

    // const _id = `${IMAGE_PREFIX}${id}`
    // const _id = `${id}`;
    const name = `${IMAGE_PREFIX}${id}`;
    // form.append("id", _id);
    form.append("file", new File([file], `${name}.${ext}`));

    const res = await fetch(url, {
        method: "POST",
        body: form,
    });

    if (res.status !== 200) throw new Error(await res.text());

    const json = (await res.json()) as ImageResponse;

    return json;
};

export const imageUrl = (imageId: string, variantName = "public") => {
    return `https://imagedelivery.net/${
        env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH
    }/${imageId}/${variantName ?? ""}`;
};
