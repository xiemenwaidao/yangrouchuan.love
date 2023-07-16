//
export const SITE = {
    title: "羊肉串愛好倶楽部",
    shortTitle: "羊肉串部",
    description: "羊肉串のレビューサイトです。",
    url: "https://www.yangrouchuan.com",
} as const;

// google map
export const MAP_DEFAULT_ZOOM = 17;

// images
export const FORM_MAX_IMAGE_COUNT = 3;
export const FORM_MAX_IMAGE_SIZE = { display: "10MB", value: 1e7 }; // 10MB
export const FORM_ALLOW_IMAGE_MINETYPES = [
    "image/jpeg",
    "image/png",
    // "image/gif"
];
export const IMAGE_PREFIX = process.env.NODE_ENV === "production" ? "p-" : "d-";
