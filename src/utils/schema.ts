import { z } from "zod";
import { toHalfWidth } from "./helpers";

export const postSchema = z.object({
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
                invalid_type_error: "半角数字を入力してください。",
            })
            .min(0, { message: "0以上100000以下の値を入力してください。" })
            .max(100000, { message: "0以上100000以下の値を入力してください。" })
            .optional()
    ),
    placeId: z.string().optional(),
});
export type PostSchema = z.infer<typeof postSchema>;
