export const SITE = {
    title: "羊肉串愛好倶楽部",
    description: "羊肉串のレビューサイトです。",
    url: "https://www.yangrouchuan.com",
} as const;

export const PALETTE_M0DE_STORAGE_KEY = "palette_mode";

export const FORM_MAX_IMAGE_COUNT = 3;

export const IMAGE_PREFIX = process.env.NODE_ENV === "production" ? "p-" : "d-";
