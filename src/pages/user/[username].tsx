// MUI
import { useColorScheme, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import type {} from "@mui/material/themeCssVarsAugmentation";

import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { stringToColor } from "~/utils/helpers";
import { generateSSGHelper } from "~/utils/ssgHelpers";
import NextImage from "next/image";
import ReviewCardWithImageModal from "~/components/ReviewCardWithImageModal";
import { useEffect, useMemo, useState } from "react";

interface ProfileSectionProps {
    username: string;
}

const ProfileSection = ({ username }: ProfileSectionProps) => {
    const { data, isLoading } = api.user.getUserByUsername.useQuery({
        username,
    });

    const [bgColor, setBgColor] = useState("");

    const theme = useTheme();
    const { mode } = useColorScheme();

    const userColors = useMemo(() => stringToColor(username), [username]);

    useEffect(() => {
        setBgColor(mode === "dark" ? userColors.dark : userColors.light);
    }, [mode, userColors]);

    if (!data) return <div>404</div>;
    if (!data.username) return <div>Something went wrong</div>;

    return (
        <>
            <Stack mt={-3}>
                <Box
                    sx={{
                        bgcolor: bgColor,
                        width: "100%",
                        height: { md: 288, xs: 182 },
                    }}
                />
                <Box sx={{ position: "relative" }}>
                    <Avatar
                        sx={{
                            width: { md: 128, xs: 100 },
                            height: { md: 128, xs: 100 },
                            position: "absolute",
                            top: { md: -64, xs: -50 },
                            left: 10,
                            border: `4px solid ${theme.vars.palette.background.default}`,
                        }}
                    >
                        <NextImage
                            src={data.profilePicture}
                            fill
                            alt={`@${data.username}'s profile picture`}
                            style={{ objectFit: "cover" }}
                        />
                    </Avatar>
                    <Typography
                        fontSize={`1.5rem`}
                        fontWeight={"bold"}
                        mt={{ md: "64px", xs: "50px" }}
                        p={{ md: 2, xs: 1 }}
                    >{`@${data.username}`}</Typography>
                </Box>
            </Stack>
        </>
    );
};

const Feed = ({ username }: { username: string }) => {
    const { data, isLoading } = api.post.getPostsByUsername.useQuery({
        username,
    });

    return <ReviewCardWithImageModal posts={data} isLoading={isLoading} />;
};

const UserPage = ({ username }: { username: string }) => {
    return (
        <>
            <Head>
                <title>{`@${username} | ${SITE.title}`}</title>
            </Head>
            <ProfileSection username={username} />
            <Feed username={username} />
        </>
    );
};

export const getStaticProps = async (
    context: GetServerSidePropsContext<{ username: string }>
) => {
    const helpers = generateSSGHelper();

    const usernameWithAt = context.params?.username;
    if (typeof usernameWithAt !== "string") throw new Error("no slug");

    const username = usernameWithAt.replace("@", "");

    /*
     * Prefetching the `post.byId` query.
     * post.byId クエリのプリフェッチ。
     * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
     * prefetch は結果を返さず、例外も発生しません - その動作が必要な場合は、代わりに fetch を使用してください。
     */
    await helpers.user.getUserByUsername.prefetch({ username });

    // Make sure to return { props: { trpcState: helpers.dehydrate() } }
    // 必ず { props: { trpcState: helpers.dehydrate() } } を返すようにしてください。
    return {
        props: {
            trpcState: helpers.dehydrate(),
            username,
        },
    };
};

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export default UserPage;
