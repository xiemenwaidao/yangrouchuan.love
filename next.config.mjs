/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import path, { dirname } from "path";
import { fileURLToPath } from "url";

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,

    sassOptions: {
        includePaths: [
            path.join(dirname(fileURLToPath(import.meta.url)), "styles"),
        ],
    },

    /**
     * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
     * out.
     *
     * @see https://github.com/vercel/next.js/issues/41980
     */
    i18n: {
        locales: ["ja"],
        defaultLocale: "ja",
    },

    images: {
        remotePatterns: [
            // clerk
            {
                protocol: "https",
                hostname: "images.clerk.dev",
                port: "",
                pathname: "/oauth_google/**",
            },
            {
                protocol: "https",
                hostname: "images.clerk.dev",
                port: "",
                pathname: "/uploaded/**",
            },
            {
                protocol: "https",
                hostname: "www.gravatar.com",
                port: "",
                pathname: "/avatar/**",
            },
            {
                protocol: "https",
                hostname: "img.clerk.com",
                port: "",
                pathname: "/**",
            },
            // cloudflare images
            {
                protocol: "https",
                hostname: "imagedelivery.net",
                port: "",
                pathname: "/**",
            },
        ],
    },
};
export default config;
