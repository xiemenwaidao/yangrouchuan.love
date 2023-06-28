import type { PropsWithChildren } from "react";
import Header from "./Header";
import { Container, Grid } from "@mui/material";
import Footer from "./Footer";

export const Layout = (props: PropsWithChildren) => {
    return (
        <Grid container sx={{ minHeight: "100vh" }} direction={`column`}>
            <Grid item xs="auto">
                <Header />
            </Grid>
            <Grid item component={`main`} xs>
                <Container maxWidth="md" sx={{ height: "100%" }}>
                    {props.children}
                </Container>
            </Grid>
            <Grid item xs="auto">
                <Footer />
            </Grid>
        </Grid>
    );
};
