import { type PostAndAuthor } from "./types";

export const toHalfWidth = (str: string) => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
};

export const getPlaceIdArrayFromPosts = (posts: PostAndAuthor[]) =>
    posts.map((obj) => obj.post.placeId);

export const stringToColor = (str: string) => {
    // Create a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the calculated hash into an RGB color
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
};
