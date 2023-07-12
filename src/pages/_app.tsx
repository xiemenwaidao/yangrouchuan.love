import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { SITE } from "~/config";
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Clerk from "~/components/Clerk";
import { Layout } from "~/components/Layout";
import ToastSetting from "~/components/ToastSetting";
import { ConfirmProvider } from "material-ui-confirm";
import createEmotionCache from "~/components/createEmotionCache";
import { type EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps<object> {
    emotionCache?: EmotionCache;
}

const theme = extendTheme();

const MyApp = (props: MyAppProps) => {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;

    return (
        <CacheProvider value={emotionCache}>
            <CssVarsProvider theme={theme} defaultMode="dark">
                {/* clerkのテーマ切替でmuiのmodeを参照しているので、CssVarsProviderの後ろじゃないとエラーでる */}
                <Clerk pageProps={pageProps}>
                    <ConfirmProvider>
                        <Head>
                            <title>{`${SITE.title}`}</title>
                            <meta
                                name="viewport"
                                content="initial-scale=1, width=device-width"
                            />
                        </Head>
                        <CssBaseline />
                        <ToastSetting />
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ConfirmProvider>
                </Clerk>
            </CssVarsProvider>
        </CacheProvider>
    );
};

export default api.withTRPC(MyApp);
