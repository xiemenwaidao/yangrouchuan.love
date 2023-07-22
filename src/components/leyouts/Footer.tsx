import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import NextImage from "next/image";
import TitleSVG from "../TitleSVG";
import { MyLink } from "../parts/MyLink";
import Stack from "@mui/material/Stack";

const links = [
    {
        title: "利用規約",
        href: "/terms",
        isBrank: false,
    },
    {
        title: "プライバシー",
        href: "/privacy",
        isBrank: false,
    },
    {
        title: "お問い合わせ",
        href: "https://forms.gle/W4qaj9A6fzgVzTtNA",
        isBrank: true,
    },
];

const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: "background.paper", py: 3 }}>
            <Container maxWidth="lg">
                <Stack gap={1}>
                    <Box
                        display={`flex`}
                        justifyContent={`center`}
                        sx={{ flexWrap: "wrap" }}
                    >
                        <NextImage
                            src={`/assets/hitusji-hasiru.png`}
                            alt="logo"
                            width={`32`}
                            height={`32`}
                        />
                        <Box width={`8rem`}>
                            <TitleSVG />
                        </Box>
                    </Box>
                    <Box
                        display={`flex`}
                        justifyContent={`center`}
                        columnGap={1}
                    >
                        {links.map((link, i) => (
                            <MyLink
                                key={i}
                                nextProps={{
                                    href: link.href,
                                }}
                                target={link.isBrank ? "_blank" : undefined}
                            >
                                {link.title}
                            </MyLink>
                        ))}
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
