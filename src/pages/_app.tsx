import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { SITE } from "~/config";
import { Toaster } from "react-hot-toast";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Clerk from "~/components/Clerk";
import { Layout } from "~/components/Layout";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <CssVarsProvider defaultMode="system">
            {/* clerkのテーマ切替でmuiのmodeを参照しているので、CssVarsProviderの後ろじゃないとエラーでる */}
            <Clerk pageProps={pageProps}>
                <Head>
                    <title>{`${SITE.title}`}</title>
                </Head>
                <CssBaseline />
                <Toaster position="bottom-center" />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Clerk>
        </CssVarsProvider>
    );
};

export default api.withTRPC(MyApp);
