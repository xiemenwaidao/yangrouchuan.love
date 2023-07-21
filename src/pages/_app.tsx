import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import { SITE } from "~/config";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Clerk from "~/components/top-level/Clerk";
import { Layout } from "~/components/leyouts/Layout";
import ToastSetting from "~/components/top-level/ToastSetting";
import { ConfirmProvider } from "material-ui-confirm";
import createEmotionCache from "~/utils/createEmotionCache";
import { type EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import theme from "~/utils/theme";
import useInitGoogleMap from "~/hooks/useInitGoogleMap";
import { Analytics } from "~/components/parts/Analytics";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps<object> {
    emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;

    useInitGoogleMap();

    return (
        <CacheProvider value={emotionCache}>
            <CssVarsProvider theme={theme} defaultMode="light">
                {/* clerkのテーマ切替でmuiのmodeを参照しているので、CssVarsProviderの後ろじゃないとエラーでる */}
                <Clerk pageProps={pageProps}>
                    <ConfirmProvider>
                        <Head>
                            <title>{`${SITE.title}`}</title>
                            <meta
                                name="viewport"
                                content="initial-scale=1, width=device-width"
                            />
                            <meta
                                name="description"
                                content={SITE.description}
                            />
                        </Head>
                        <CssBaseline />
                        <ToastSetting />
                        <Analytics />
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
