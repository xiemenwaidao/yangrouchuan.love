import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { type ReactNode } from "react";
import { useThemeStore } from "~/store/useThemeStore";

const Theme = ({ children }: { children: ReactNode }) => {
    // システムのテーマモードを取得
    // const prefersPaletteMode = useMediaQuery("(prefers-color-scheme: dark)")
    //     ? "dark"
    //     : "light";

    // localstorageからテーマモードを取得
    const paletteMode = useThemeStore((state) => state.theme);

    const theme = createTheme({
        palette: {
            mode: paletteMode,
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default Theme;
