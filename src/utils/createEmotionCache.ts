import { type EmotionCache } from "@emotion/react";
import createCache, { type Options } from "@emotion/cache";

const isBrowser = typeof window !== "undefined";

export default function createEmotionCache(): EmotionCache {
    let insertionPoint: HTMLElement | undefined = undefined;

    if (isBrowser) {
        const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
            'meta[name="emotion-insertion-point"]'
        );
        if (emotionInsertionPoint !== null) {
            insertionPoint = emotionInsertionPoint;
        }
    }

    const cacheOptions: Options = { key: "mui-style", insertionPoint };

    return createCache(cacheOptions);
}
