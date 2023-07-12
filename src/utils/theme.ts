import { Noto_Sans_JP } from "next/font/google";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const notoSansJP = Noto_Sans_JP({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
});

const theme = extendTheme({
    typography: {
        fontFamily: notoSansJP.style.fontFamily,
    },
});

export default theme;
