import { SignUp } from "@clerk/nextjs";
import Grid from "@mui/material/Grid";
import { type NextPage } from "next";
import Head from "next/head";
import { SITE } from "~/config";

const SignUpPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`Sign Up | ${SITE.title}`}</title>
            </Head>
            <Grid
                container
                alignContent={`center`}
                justifyContent={`center`}
                sx={{ height: "100%" }}
            >
                <Grid item>
                    <SignUp />
                </Grid>
            </Grid>
        </>
    );
};

export default SignUpPage;
