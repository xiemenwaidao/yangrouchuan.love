import { type PostAndAuthor } from "./types";
import tinycolor from "tinycolor2";

export const toHalfWidth = (str: string) => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
};

export const getPlaceIdArrayFromPosts = (posts: PostAndAuthor[]) =>
    posts.map((obj) => obj.post.placeId);

/** @see https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/ */
export class Random {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(seed = 88675123) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }

    // XorShift
    next() {
        const t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        return (this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8)));
    }

    // min以上max以下の乱数を生成する
    nextInt(min: number, max: number) {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
    }
}

interface ModeColors {
    dark: string;
    light: string;
}

export const stringToColor = (str: string): ModeColors => {
    const hash = [...str].reduce(
        (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash),
        0
    );

    // console.log(str, { hash });

    const h = hash % 360;
    const s = (hash % 25) + 75;
    const l = 40;

    const hsl = { h, s, l };
    const darkColor = tinycolor({ ...hsl, l: l - 10 }); // decrease lightness by 10 for dark mode
    const lightColor = tinycolor({ ...hsl, l: l + 10 }); // increase lightness by 10 for light mode

    const result: ModeColors = {
        dark: darkColor.toHexString(),
        light: lightColor.toHexString(),
    };

    // console.log(result);

    return result;
};
