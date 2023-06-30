import Document, {
    Html,
    Head,
    Main,
    NextScript,
    type DocumentContext,
} from "next/document";
import { getInitColorSchemeScript } from "@mui/material/styles";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
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
}

export default MyDocument;
