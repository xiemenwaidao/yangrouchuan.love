import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { SITE } from "~/config";
import { Toaster } from "react-hot-toast";
import { jaJP } from "@clerk/localizations";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps} localization={jaJP}>
            <CssVarsProvider defaultMode="system">
                <Head>
                    <title>{`${SITE.title}`}</title>
                </Head>
                <CssBaseline />
                <Toaster position="bottom-center" />
                <Component {...pageProps} />
            </CssVarsProvider>
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
