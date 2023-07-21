import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     * サーバーサイドの環境変数スキーマをここで指定します。これにより、アプリが無効な環境変数でビルドされないようにすることができます。
     */
    server: {
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(["development", "test", "production"]),
        NEXT_CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
        NEXT_CLOUDFLARE_IMAGES_API_TOKEN: z.string().min(1),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     * クライアント側の環境変数スキーマをここで指定します。これにより、アプリが無効な環境変数でビルドされないようにすることができます。クライアントに公開するためには、接頭辞にNEXT_PUBLIC_を付けてください。
     */
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1),
        NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH: z.string().min(1),
        NEXT_PUBLIC_GA_ID: z.string().min(1),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     * Next.jsのエッジランタイム（例：ミドルウェア）やクライアントサイドでは、process.envを通常のオブジェクトとして分割代入することはできません。したがって、手動で分割代入する必要があります。
     */
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        NEXT_CLOUDFLARE_ACCOUNT_ID: process.env.NEXT_CLOUDFLARE_ACCOUNT_ID,
        NEXT_CLOUDFLARE_IMAGES_API_TOKEN:
            process.env.NEXT_CLOUDFLARE_IMAGES_API_TOKEN,
        NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH:
            process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH,
        NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     * SKIP_ENV_VALIDATIONを使用してbuildまたはdevを実行すると、環境変数の検証をスキップできます。
     * これは特にDockerビルドに便利です。
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
