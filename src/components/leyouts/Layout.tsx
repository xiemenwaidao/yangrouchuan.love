import type { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
// import Grid from "@mui/material/Grid";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";

export const Layout = (props: PropsWithChildren) => {
    return (
        <Grid container sx={{ minHeight: "100vh" }} direction={`column`}>
            <Grid xs="auto">
                <Header />
            </Grid>
            <Grid xs>
                <Container
                    maxWidth="md"
                    component={`main`}
                    sx={{ height: "100%", py: 3 }}
                >
                    {props.children}
                </Container>
            </Grid>
            <Grid xs="auto">
                <Footer />
            </Grid>
        </Grid>
    );
};
