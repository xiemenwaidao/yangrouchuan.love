import type { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

export const Layout = (props: PropsWithChildren) => {
    return (
        <Grid container sx={{ minHeight: "100vh" }} direction={`column`}>
            <Grid item xs="auto">
                <Header />
            </Grid>
            <Grid item component={`main`} xs>
                <Container maxWidth="md" sx={{ height: "100%", py: 3 }}>
                    {props.children}
                </Container>
            </Grid>
            <Grid item xs="auto">
                <Footer />
            </Grid>
        </Grid>
    );
};
