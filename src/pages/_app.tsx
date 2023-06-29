import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { SITE } from "~/config";
import { Toaster } from "react-hot-toast";
import Theme from "~/components/Theme";
import { jaJP } from "@clerk/localizations";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps} localization={jaJP}>
            <Head>
                <title>{`${SITE.title}`}</title>
            </Head>
            <Theme>
                <Toaster position="bottom-center" />
                <Component {...pageProps} />
            </Theme>
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
