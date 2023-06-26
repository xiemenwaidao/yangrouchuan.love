import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useState, type ReactNode, useEffect } from "react";
import { useThemeStore } from "~/store/useThemeStore";

const Theme = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    // localstorageからテーマモードを取得
    const paletteMode = useThemeStore((state) => state.theme);

    useEffect(() => {
        setMounted(true);
    }, []);

    // まだクライアントサイドでレンダリングが行われていない場合は何もレンダリングしない
    // if (!mounted) {
    //     return null;
    // }

    const theme = createTheme({
        palette: {
            // mode: paletteMode,
            mode: mounted ? paletteMode : "dark",
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
