import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { stringToColor } from "~/utils/helpers";
import { generateSSGHelper } from "~/utils/ssgHelpers";
import NextImage from "next/image";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ProfileSectionProps {
    username: string;
}

const ProfileSection = ({ username }: ProfileSectionProps) => {
    const { data, isLoading } = api.user.getUserByUsername.useQuery({
        username,
    });

    const theme = useTheme();

    if (!data) return <div>404</div>;
    if (!data.username) return <div>Something went wrong</div>;

    return (
        <>
            <Head>
                <title>{`@${data.username} | ${SITE.title}`}</title>
            </Head>
            <Stack mt={-3}>
                <Box
                    sx={{
                        bgcolor: stringToColor(data.id),
                        width: "100%",
                        height: { md: 288, xs: 182 },
                    }}
                ></Box>
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

const UserPage = ({ username }: { username: string }) => {
    return (
        <>
            <ProfileSection username={username} />
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
