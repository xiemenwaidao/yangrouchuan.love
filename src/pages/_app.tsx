import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { SITE } from "~/config";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps}>
            <Head>
                <title>{`${SITE.title}`}</title>
                <meta name="description" content="羊肉串爱你们" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
