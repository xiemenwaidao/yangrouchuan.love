import { z } from "zod";
import { toHalfWidth } from "./helpers";
import { FORM_MAX_IMAGE_COUNT } from "~/config";

const REQUIRED_ERROR_TEXT = "必須項目です。";

const ALLOW_IMAGE_MINETYPES = [
    "image/jpeg",
    "image/png",
    // "image/gif"
];

const commonSchema = {
    rating: z.coerce
        .number({
            required_error: REQUIRED_ERROR_TEXT,
            invalid_type_error: "半角数字を入力してください。",
        })
        .min(1)
        .max(5)
        .step(1, { message: "正常な値を入力してください。" }),
    content: z
        .string({ required_error: REQUIRED_ERROR_TEXT })
        .min(1, { message: "入力は1文字以上25文字以内にしてください。" })
        .max(25, { message: "入力は1文字以上25文字以内にしてください。" }),
    price: z.preprocess(
        (v) => {
            if (v === "") return undefined;
            // 半角数字かNANが🐸
            if (typeof v === "string") return Number(toHalfWidth(v));
            return v;
        },
        z
            .number({
                invalid_type_error: "半角数字を入力してください。",
                // required_error: REQUIRED_ERROR_TEXT,
            })
            .min(0, { message: "0以上100000以下の値を入力してください。" })
            .max(100000, {
                message: "0以上100000以下の値を入力してください。",
            })
            .optional()
    ),
};

export const frontPostSchema = z.object({
    ...commonSchema,
    address: z.string({
        required_error: REQUIRED_ERROR_TEXT,
    }),
    // @see https://developers.cloudflare.com/images/cloudflare-images/upload-images/formats-limitations/
    images: z
        .custom<File[]>()
        .refine((files) => files.length !== 0, { message: REQUIRED_ERROR_TEXT })
        .refine((files) => files.length <= FORM_MAX_IMAGE_COUNT, {
            message: "アップロードできる最大枚数は3枚です。",
        })
        .refine(
            (files) =>
                files.every((file) =>
                    ALLOW_IMAGE_MINETYPES.includes(file.type)
                ),

            {
                message: "アップロード可能な拡張子はjpg/pngです。",
            }
        )
        .refine((files) => files.every((file) => file.size < 1000000), {
            message: "10MB以下の画像をアップロードしてください。",
        }),
});

export type FrontPostSchema = z.infer<typeof frontPostSchema>;
export type FrontPostSchemaKeys = keyof FrontPostSchema;

const PLACE_REQUIRED_ERROR_TEXT =
    "場所の更新に失敗しました。もう一度、場所を指定してください。";

export const backPostSchema = z.object({
    ...commonSchema,
    place: z.object({
        place_id: z.string({
            required_error: `${PLACE_REQUIRED_ERROR_TEXT}（place_id）`,
        }),
        title: z.string({
            required_error: `${PLACE_REQUIRED_ERROR_TEXT}（title）`,
        }),
        address: z.string({
            required_error: `${PLACE_REQUIRED_ERROR_TEXT}（address）`,
        }),
    }),
    images: z.array(z.string({ required_error: "必須項目です" })),
});

export type BackPostSchema = z.infer<typeof backPostSchema>;
