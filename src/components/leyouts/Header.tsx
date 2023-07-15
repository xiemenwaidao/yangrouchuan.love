import {
    ClerkLoaded,
    ClerkLoading,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
} from "@clerk/nextjs";
import { SITE } from "~/config";

// MUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";

import { useState } from "react";
import { ThemeSwitch } from "../parts/ThemeSwitch";
import { MyLink } from "../parts/MyLink";
import NextLink from "next/link";
import NextImage from "next/image";

const pages = [{ title: "投稿する", href: "/create", auth: true }];
interface MenuItemProps {
    onClick: () => void;
    href: string;
    title: string;
}
const MobileMenuItem = (props: MenuItemProps) => {
    return (
        <MyLink
            nextProps={{ href: props.href }}
            muiProps={{ underline: "hover" }}
        >
            <MenuItem onClick={props.onClick}>
                <Typography textAlign="center">{props.title}</Typography>
            </MenuItem>
        </MyLink>
    );
};

const DesktopMenuItem = (props: MenuItemProps) => {
    return (
        <MyLink
            nextProps={{ href: props.href }}
            muiProps={{ underline: "hover", color: "white" }}
        >
            <Button
                onClick={props.onClick}
                sx={{ color: "white", display: "block" }}
            >
                {props.title}
            </Button>
        </MyLink>
    );
};

function Header() {
    const { user } = useUser();

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar
            position="static"
            sx={{
                // box-shadowをちゃんとつけるために必要
                position: "relative",
            }}
        >
            <Container maxWidth="md">
                <Toolbar disableGutters>
                    {/* desktop */}
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            // letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <NextLink href={`/`}>
                            <Stack direction={`row`}>
                                <NextImage
                                    src={`/assets/hitusji-hasiru.png`}
                                    alt="logo"
                                    width={`32`}
                                    height={`32`}
                                    style={{}}
                                />
                                <span>{SITE.title}</span>
                            </Stack>
                        </NextLink>
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page, index) => {
                                if (page.auth && !user) return null;

                                return (
                                    <MobileMenuItem
                                        key={index}
                                        onClick={handleCloseNavMenu}
                                        href={page.href}
                                        title={page.title}
                                    />
                                );
                            })}
                            <Box sx={{ display: { xs: "block", md: "none" } }}>
                                <ThemeSwitch />
                            </Box>
                        </Menu>
                    </Box>

                    {/* mobile */}
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            // letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                            fontSize: "1.0rem",
                        }}
                    >
                        <NextLink
                            href={`/`}
                            style={{ display: "grid", alignItems: "center" }}
                        >
                            <NextImage
                                src={`/assets/hitusji-hasiru.png`}
                                alt="logo"
                                width={`32`}
                                height={`32`}
                                style={{}}
                            />
                            {/* <span>{SITE.shortTitle}</span> */}
                        </NextLink>
                    </Typography>

                    {/* desktop */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages.map((page, index) => {
                            if (page.auth && !user) return null;

                            return (
                                <DesktopMenuItem
                                    key={index}
                                    onClick={handleCloseNavMenu}
                                    href={page.href}
                                    title={page.title}
                                />
                            );
                        })}
                    </Box>

                    {/* darkmode switch (desktop) */}
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                        <ThemeSwitch />
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <ClerkLoading>
                            <Skeleton
                                variant="circular"
                                width={`2rem`}
                                height={`2rem`}
                            />
                        </ClerkLoading>
                        <SignedIn>
                            <ClerkLoaded>
                                <UserButton
                                    userProfileMode="navigation"
                                    userProfileUrl="/account"
                                    afterSignOutUrl="/"
                                    afterMultiSessionSingleSignOutUrl="/"
                                />
                            </ClerkLoaded>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton
                            //  mode="modal"
                            >
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </SignInButton>
                        </SignedOut>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
