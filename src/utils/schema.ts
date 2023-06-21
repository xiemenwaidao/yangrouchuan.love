import { z } from "zod";
import { toHalfWidth } from "./helpers";

const commonSchema = {
    rating: z.number().min(0).max(5).step(0.5),
    content: z
        .string({ required_error: "必須項目です" })
        .min(1, { message: "1文字以上の文章を入力してください" }),
    price: z.preprocess(
        (v) => {
            if (v === "") return undefined;
            if (typeof v === "string") return Number(toHalfWidth(v));
            return v;
        },
        z
            .number({
                invalid_type_error: "半角数字を入力してください",
                required_error: "必須項目です",
            })
            .min(0, { message: "0以上100000以下の値を入力してください" })
            .max(100000, { message: "0以上100000以下の値を入力してください" })
    ),
};

export const frontPostSchema = z.object({
    ...commonSchema,
    address: z.string({
        required_error: "必須項目です",
    }),
});

export type FrontPostSchema = z.infer<typeof frontPostSchema>;
export type FrontPostSchemaKeys = keyof FrontPostSchema;

export const backPostSchema = z.object({
    ...commonSchema,
    place: z.object({
        place_id: z.string({
            required_error: "もう一度、場所を指定してください（place_id）",
        }),
        title: z.string({
            required_error: "もう一度場所を指定してください（title）",
        }),
        address: z.string({
            required_error: "もう一度場所を指定してください（address）",
        }),
    }),
});

export type BackPostSchema = z.infer<typeof backPostSchema>;

// export const postSchema = z.object({
//     rating: z.number().min(0).max(5).step(0.5),
//     content: z
//         .string({ required_error: "必須項目です" })
//         .min(1, { message: "1文字以上の文章を入力してください" }),
//     price: z.preprocess(
//         (v) => {
//             if (v === "") return undefined;
//             if (typeof v === "string") return Number(toHalfWidth(v));
//             return v;
//         },
//         z
//             .number({
//                 invalid_type_error: "半角数字を入力してください",
//                 required_error: "必須項目です",
//             })
//             .min(0, { message: "0以上100000以下の値を入力してください" })
//             .max(100000, { message: "0以上100000以下の値を入力してください" })
//     ),
//     // placeId: z.string(),
//     address: z.string({
//         required_error: "もう一度場所を指定してください（address）",
//     }),
// });
// export type PostSchema = z.infer<typeof postSchema>;

// export type PostSchemaKeys = keyof PostSchema;
