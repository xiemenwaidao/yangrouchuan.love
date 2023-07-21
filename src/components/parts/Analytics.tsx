import { type FC } from "react";
import Script from "next/script";
import { env } from "~/env.mjs";

// @see https://maku.blog/p/zycmw6f/

// サーバーの環境変数で Google Analytics の測定 ID を指定します
const ANALYTICS_ID = env.NEXT_PUBLIC_GA_ID;
// あるいはハードコーディングでも可
// const ANALYTICS_ID = 'G-ABCDE12345'

/** Google Analytics によるアクセス解析を行うためのコンポーネント */
export const Analytics: FC = () => {
    if (process.env.NODE_ENV !== "production") {
        // 開発サーバー上での実行 (next dev) では何も出力しない
        return <></>;
    }

    if (!ANALYTICS_ID) {
        console.warn("NEXT_PUBLIC_GA_ID not defined");
        return <></>;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${ANALYTICS_ID}');
                `}
            </Script>
        </>
    );
};
