import { ClerkProvider } from "@clerk/nextjs";
import { type ReactNode } from "react";
import { jaJP } from "@clerk/localizations";
import { useColorScheme } from "@mui/material/styles";
import { dark } from "@clerk/themes";

interface Props {
    pageProps: object;
    children?: ReactNode;
}

const Clerk = (props: Props) => {
    const { mode } = useColorScheme();

    return (
        <ClerkProvider
            {...props.pageProps}
            localization={jaJP}
            appearance={{
                baseTheme: mode === "dark" ? dark : undefined,
            }}
        >
            {props.children}
        </ClerkProvider>
    );
};

export default Clerk;
