import { SignIn } from "@clerk/nextjs";
import { Grid } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { SITE } from "~/config";

const SignInPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`Sign In | ${SITE.title}`}</title>
            </Head>
            <Grid
                container
                alignContent={`center`}
                justifyContent={`center`}
                sx={{ height: "100%" }}
            >
                <Grid item>
                    <SignIn />
                </Grid>
            </Grid>
        </>
    );
};

export default SignInPage;
