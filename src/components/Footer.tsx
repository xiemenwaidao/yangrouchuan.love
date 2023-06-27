import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { SITE } from "~/config";

const Copyright = () => {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href={SITE.url}>
                {SITE.title}
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
};

const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
            <Container maxWidth="lg">
                {/* <Typography variant="h6" align="center" gutterBottom>
                    {SITE.title}
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    {SITE.description}
                </Typography> */}
                <Copyright />
            </Container>
        </Box>
    );
};

export default Footer;
