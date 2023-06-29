import { Html, Head, Main, NextScript } from "next/document";
import { getInitColorSchemeScript } from "@mui/material/styles";

export default function Document() {
    return (
        <Html lang="ja">
            <Head>
                <meta name="description" content="羊肉串爱你们" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                {getInitColorSchemeScript()}
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
