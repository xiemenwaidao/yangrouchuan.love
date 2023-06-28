import { SignIn } from "@clerk/nextjs";
import { Grid } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/Layout";
import { SITE } from "~/config";

const SignInPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`Sign In | ${SITE.title}`}</title>
            </Head>
            <Layout>
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
            </Layout>
        </>
    );
};

export default SignInPage;
