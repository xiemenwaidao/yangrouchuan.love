import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";

import { UserProfile, useClerk, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

const ProfilePage: NextPage = () => {
    const { user } = useUser();
    const { signOut } = useClerk();

    const { mutate, isLoading } = api.user.deleteUser.useMutation({
        onSuccess: () => {
            void signOut();
            toast.success("ユーザーを削除しました。");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

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
                    <Box sx={{ textAlign: "center", mt: { xs: 5, md: 3 } }}>
                        {user && (
                            <LoadingButton
                                loading={isLoading}
                                loadingPosition="start"
                                startIcon={<DeleteIcon />}
                                variant="outlined"
                                onClick={() => mutate({ id: user?.id })}
                            >
                                削除する
                            </LoadingButton>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default ProfilePage;
