import { Noto_Sans_JP } from "next/font/google";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const notoSansJP = Noto_Sans_JP({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
});

const theme = extendTheme({
    typography: {
        fontFamily: notoSansJP.style.fontFamily,
    },
    colorSchemes: {
        light: {
            palette: {
                background: {
                    // default: "#f1ecdd",
                    // paper: "#f1ecdd",
                    default: "#fff9f2",
                    paper: "#fff9f2",
                },
                primary: {
                    // main: "#D6664B",
                    main: "#c14f66",
                },
                secondary: {
                    main: red[700],
                },
            },
        },
    },
});

export default theme;
