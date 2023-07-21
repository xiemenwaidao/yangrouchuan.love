//
export const SITE = {
    title: "羊肉串倶楽部",
    shortTitle: "羊肉串部",
    description: "羊肉串のレビュー共有サイトです。",
    url: "https://www.yangrouchuan.com",
} as const;

// google map
export const MAP_DEFAULT_ZOOM = 17;
export const MAP_LIBRARIES: (
    | "drawing"
    | "geometry"
    | "localContext"
    | "places"
    | "visualization"
)[] = ["places"];
export const MAP_DEFAULT_CENTER = { lat: 34.7024, lng: 135.4959 } as const; // 大阪駅
export const MAP_JP_CENTER = { lat: 37.94, lng: 138.36 } as const; // 佐渡島が良い感じ

// images
export const FORM_MAX_IMAGE_COUNT = 3;
export const FORM_MAX_IMAGE_SIZE = { display: "10MB", value: 1e7 }; // 10MB
export const FORM_ALLOW_IMAGE_MINETYPES = [
    "image/jpeg",
    "image/png",
    // "image/gif"
];
export const IMAGE_PREFIX = process.env.NODE_ENV === "production" ? "p-" : "d-";

// error text
export const ERROR_USER_NOT_FOUND = "ユーザーが見つかりませんでした";
