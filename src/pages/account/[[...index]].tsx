import { UserProfile } from "@clerk/nextjs";
import Grid from "@mui/material/Grid";
import { type NextPage } from "next";
import Head from "next/head";
import { SITE } from "~/config";

// TODO: ページ遷移時に左上から表示されるのを防ぐ

const ProfilePage: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`Profile | ${SITE.title}`}</title>
            </Head>
            <Grid
                container
                alignContent={`center`}
                justifyContent={`center`}
                sx={{ height: "100%" }}
            >
                <Grid item>
                    <UserProfile
                        path="/account"
                        routing="path"
                        appearance={{
                            elements: {
                                card: {
                                    maxWidth: "calc(100vw - (5rem + 24px * 2))",
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default ProfilePage;
