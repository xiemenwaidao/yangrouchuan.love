import { Kaisei_Decol } from "next/font/google";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const kaiseiDecol = Kaisei_Decol({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
});

const theme = extendTheme({
    typography: {
        fontFamily: kaiseiDecol.style.fontFamily,
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
                error: {
                    main: "#ff0076",
                },
            },
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    transition: "all 0.2s linear",
                },
            },
        },
    },
});

export default theme;
