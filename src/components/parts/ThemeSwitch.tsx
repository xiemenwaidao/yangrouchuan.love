import { styled, useColorScheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";

const TestSwith = () => {
    return (
        <label className="switch">
            <input className="switch__input" type="checkbox" role="switch" />
            <svg
                className="switch__scene"
                viewBox="0 0 48 24"
                width="48px"
                height="24px"
                aria-hidden="true"
            >
                <symbol id="switch-cloud" viewBox="0 0 10 6">
                    <path d="m7.5,1c-.238,0-.463.049-.675.125-.55-.681-1.381-1.125-2.325-1.125-1.13,0-2.103.633-2.614,1.556-.124-.033-.251-.056-.386-.056-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5c.134,0,.262-.023.386-.056.511.924,1.484,1.556,2.614,1.556.943,0,1.775-.444,2.325-1.125.212.076.437.125.675.125,1.105,0,2-.895,2-2s-.895-2-2-2Z" />
                </symbol>
                <symbol id="switch-star" viewBox="0 0 4 4">
                    <path d="m2.277.172l.379.767c.045.091.132.154.233.169l.847.123c.253.037.355.348.171.527l-.613.597c-.073.071-.106.173-.089.273l.145.843c.043.252-.222.445-.448.326l-.757-.398c-.09-.047-.197-.047-.287,0l-.757.398c-.227.119-.491-.073-.448-.326l.145-.843c.017-.1-.016-.202-.089-.273L.094,1.758c-.183-.179-.082-.49.171-.527l.847-.123c.101-.015.188-.078.233-.169l.379-.767c.113-.23.441-.23.554,0Z" />
                </symbol>
                <defs>
                    <linearGradient
                        id="switch-sun1"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0" stop-color="hsl(18,90%,50%)" />
                        <stop offset="1" stop-color="hsl(43,90%,50%)" />
                    </linearGradient>
                    <linearGradient
                        id="switch-sun2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0" stop-color="hsl(43,90%,50%)" />
                        <stop offset="1" stop-color="hsl(33,90%,50%)" />
                    </linearGradient>
                    <linearGradient
                        id="switch-moon1"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0" stop-color="hsl(213,90%,95%)" />
                        <stop offset="1" stop-color="hsl(213,90%,85%)" />
                    </linearGradient>
                    <linearGradient
                        id="switch-moon2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0" stop-color="hsla(213,90%,95%,0)" />
                        <stop offset="1" stop-color="hsla(213,90%,95%,1)" />
                    </linearGradient>
                    <linearGradient
                        id="switch-moon3"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0" stop-color="hsla(213,90%,75%,1)" />
                        <stop offset="1" stop-color="hsla(213,90%,75%,0)" />
                    </linearGradient>
                    <linearGradient
                        id="switch-cloud1"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0" stop-color="hsla(0,0%,100%,1)" />
                        <stop offset="1" stop-color="hsla(0,0%,100%,0)" />
                    </linearGradient>
                </defs>
                <g className="switch__stars" fill="hsl(213,90%,95%)">
                    <g
                        className="switch__star"
                        transform="translate(28,14) scale(0)"
                    >
                        <use href="#switch-star" width="4px" height="4px" />
                    </g>
                    <g
                        className="switch__star"
                        transform="translate(21,13) scale(0)"
                    >
                        <use href="#switch-star" width="4px" height="4px" />
                    </g>
                    <g
                        className="switch__star"
                        transform="translate(17,10) scale(0)"
                    >
                        <use href="#switch-star" width="4px" height="4px" />
                    </g>
                    <g
                        className="switch__star"
                        transform="translate(24,6) scale(0)"
                    >
                        <use href="#switch-star" width="4px" height="4px" />
                    </g>
                    <g
                        className="switch__star"
                        transform="translate(31,5) scale(0)"
                    >
                        <use href="#switch-star" width="4px" height="4px" />
                    </g>
                </g>
                <g className="switch__handle" transform="translate(12,12)">
                    <g className="switch__handle-side">
                        <circle r="8" fill="url(#switch-sun1)" />
                        <circle r="6.5" fill="url(#switch-sun2)" />
                    </g>
                    <g className="switch__handle-side" opacity="0">
                        <circle r="8" fill="url(#switch-moon1)" />
                        <circle r="6.5" fill="url(#switch-moon2)" />
                        <clipPath id="switch-moon-clip">
                            <circle
                                className="switch__moon-hole"
                                r="1.5"
                                cx="-6"
                                cy="2"
                            />
                            <circle
                                className="switch__moon-hole"
                                r="1.5"
                                cx="-1"
                                cy="3"
                            />
                            <circle
                                className="switch__moon-hole"
                                r="2"
                                cx="-1"
                                cy="8"
                            />
                            <circle
                                className="switch__moon-hole"
                                r="1"
                                cx="2"
                                cy="0"
                            />
                            <circle
                                className="switch__moon-hole"
                                r="5"
                                cx="8"
                                cy="6"
                            />
                        </clipPath>
                        <circle
                            r="8"
                            fill="url(#switch-moon3)"
                            clip-path="url(#switch-moon-clip)"
                        />
                    </g>
                </g>
                <g fill="url(#switch-cloud1)">
                    <use
                        className="switch__cloud"
                        href="#switch-cloud"
                        width="10"
                        height="6"
                        transform="translate(34,9)"
                    />
                    <use
                        className="switch__cloud"
                        href="#switch-cloud"
                        width="10"
                        height="6"
                        transform="translate(24,13) scale(0.8)"
                    />
                    <use
                        className="switch__cloud"
                        href="#switch-cloud"
                        width="10"
                        height="6"
                        transform="translate(24,5) scale(0.6)"
                    />
                </g>
            </svg>
            <span className="switch__text">Dark Mode</span>
        </label>
    );
};

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(22px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff"
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "#aab4be",
                [theme.getColorSchemeSelector("dark")]: {
                    backgroundColor: "#8796A5",
                },
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.vars.palette.background.default,
        [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "#003892",
        },
        width: 32,
        height: 32,
        "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                "#000"
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "#8796A5",
        },
        borderRadius: 20 / 2,
    },
}));

export const ThemeSwitch = () => {
    const { mode, setMode } = useColorScheme();
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mode === "system" && prefersDarkMode) {
            setMode("dark");
        }
    }, [mode, prefersDarkMode, setMode]);

    if (!mounted) {
        // for server-side rendering
        // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
        return null;
    }

    return (
        // <TestSwith />
        <MaterialUISwitch
            checked={mode === "dark"}
            onClick={() => {
                if (mode === "light") {
                    setMode("dark");
                } else {
                    setMode("light");
                }
            }}
            sx={{ m: 1 }}
        />
    );
};
