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
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useConfirm } from "material-ui-confirm";

const ProfilePage: NextPage = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const confirm = useConfirm();

    const { mutate, isLoading } = api.user.deleteUser.useMutation({
        onSuccess: () => {
            void signOut();
            toast.success("アカウントを削除しました。");
            void router.push("/");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onDelete = useCallback(() => {
        if (!user) return;
        void confirm({
            description: "アカウントを削除しますか？削除しても投稿は残ります。",
        })
            .then(() => {
                mutate({ id: user?.id });
            })
            .catch(() => toast.info("キャンセルしました。"));
    }, [confirm, mutate, user]);

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
                                onClick={() => onDelete()}
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
