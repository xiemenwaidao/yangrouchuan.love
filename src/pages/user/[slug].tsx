import { Avatar, Box } from "@mui/material";
import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { stringToColor } from "~/utils/helpers";
import { generateSSGHelper } from "~/utils/ssgHelpers";
import NextImage from "next/image";

const UserPage = ({ username }: { username: string }) => {
    const { data, isLoading } = api.user.getUserByUsername.useQuery({
        username,
    });

    if (!data) return <div>404</div>;
    if (!data.username) return <div>Something went wrong</div>;

    return (
        <>
            <Head>
                <title>{`${data.username} | ${SITE.title}`}</title>
            </Head>

            <Box sx={{ pb: 36 }}>
                <Box
                    sx={{
                        bgcolor: stringToColor(data.username),
                        width: "100%",
                        height: "288px",
                        position: "relative",
                    }}
                >
                    <Avatar sx={{ width: { md: 128 }, height: { md: 128 } }}>
                        <NextImage
                            src={data.profilePicture}
                            fill
                            alt={`@${data.username}'s profile picture`}
                            style={{ objectFit: "cover" }}
                        />
                    </Avatar>
                </Box>
            </Box>

            <div>{`@${data.username}`}</div>
        </>
    );
};

export const getStaticProps = async (
    context: GetServerSidePropsContext<{ slug: string }>
) => {
    const helpers = generateSSGHelper();

    const slug = context.params?.slug;
    if (typeof slug !== "string") throw new Error("no slug");

    const username = slug.replace("@", "");

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
