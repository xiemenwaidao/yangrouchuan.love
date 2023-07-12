import { type PostAndAuthor } from "./types";
import tinycolor from "tinycolor2";

export const toHalfWidth = (str: string) => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
};

export const getPlaceIdArrayFromPosts = (posts: PostAndAuthor[]) =>
    posts.map((obj) => obj.post.placeId);

interface ModeColors {
    dark: string;
    light: string;
}

export const stringToColor = (str: string): ModeColors => {
    // Create a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the calculated hash into an RGB color
    const rgb: [number, number, number] = [
        (hash & 0xff0000) >> 16,
        (hash & 0x00ff00) >> 8,
        hash & 0x0000ff,
    ];

    const color = tinycolor({ r: rgb[0], g: rgb[1], b: rgb[2] });

    // Convert RGB to HSL
    const hsl = color.toHsl();

    // Adjust lightness for dark mode and convert back to RGB
    const darkColor = tinycolor({ h: hsl.h, s: hsl.s, l: hsl.l * 0.4 });
    const rgbDark = darkColor.toHexString();

    // Adjust lightness for light mode and convert back to RGB
    const lightColor = tinycolor({
        h: hsl.h,
        s: hsl.s,
        l: Math.min(1, hsl.l * 1.6),
    });
    const rgbLight = lightColor.toHexString();

    return {
        dark: rgbDark,
        light: rgbLight,
    };
};
