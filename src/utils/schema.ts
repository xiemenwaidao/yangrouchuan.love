import { z } from "zod";
import { toHalfWidth } from "./helpers";
import {
    FORM_ALLOW_IMAGE_MINETYPES,
    FORM_MAX_IMAGE_COUNT,
    FORM_MAX_IMAGE_SIZE,
} from "~/config";

const REQUIRED_ERROR_TEXT = "必須項目です。";

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
    skewerCount: z.preprocess((v) => {
        if (v === 0) return undefined;
        return v;
    }, z.number().optional()),
};

export const frontPostSchema = z
    .object({
        ...commonSchema,
        id: z.string().optional(),
        address: z
            .string({
                required_error: REQUIRED_ERROR_TEXT,
            })
            .refine((value) => value.startsWith("日本"), {
                message: "日本の店舗のみ登録可能です。🙇🏻‍♂️",
            }),
        // @see https://developers.cloudflare.com/images/cloudflare-images/upload-images/formats-limitations/
        images: z
            .custom<(File | string)[]>()
            // required
            .refine((images) => images.length !== 0, {
                message: REQUIRED_ERROR_TEXT,
            })
            .refine((images) => images.length <= FORM_MAX_IMAGE_COUNT, {
                message: "アップロードできる最大枚数は3枚です。",
            })
            .refine(
                (images) =>
                    images.every((image) => {
                        if (image instanceof File)
                            return FORM_ALLOW_IMAGE_MINETYPES.includes(
                                image.type
                            );
                        return true;
                    }),

                {
                    message: "アップロード可能な拡張子はjpg/pngです。",
                }
            )
            .refine(
                (images) =>
                    images.every((image) => {
                        if (image instanceof File)
                            return image.size < FORM_MAX_IMAGE_SIZE.value;
                        return true;
                    }),
                {
                    message: `${FORM_MAX_IMAGE_SIZE.display}以下の画像をアップロードしてください。`,
                }
            ),
    })
    .refine(
        ({ price, skewerCount }) => {
            // priceに値が入っている場合はskewerCountも必須
            if (price !== undefined && skewerCount === undefined) {
                return false;
            }
            return true;
        },
        {
            message: "値段を入力した場合は串数も0以上の値を選択してください。",
            path: ["price"],
        }
    );

export type FrontPostSchema = z.infer<typeof frontPostSchema>;
export type FrontPostSchemaKeys = keyof FrontPostSchema;
export type FrontPostSchemaOmitId = Omit<FrontPostSchema, "id">;

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
        lat: z.number({
            required_error: `${PLACE_REQUIRED_ERROR_TEXT}（lat）`,
        }),
        lng: z.number({
            required_error: `${PLACE_REQUIRED_ERROR_TEXT}（lng）`,
        }),
    }),
    images: z.array(z.string({ required_error: "必須項目です" })),
});
export type BackPostSchema = z.infer<typeof backPostSchema>;

export const backPostUpdateSchema = z.object({
    ...commonSchema,
    images: z.array(z.string({ required_error: "必須項目です" })),
});
export type BackPostUpdateSchema = z.infer<typeof backPostUpdateSchema>;
