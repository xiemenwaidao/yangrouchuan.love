import { CssBaseline } from "@mui/material";
import { type ReactNode } from "react";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

const Theme = ({ children }: { children: ReactNode }) => {
    return (
        <CssVarsProvider defaultMode="system">
            <CssBaseline />
            {children}
        </CssVarsProvider>
    );
};

export default Theme;
