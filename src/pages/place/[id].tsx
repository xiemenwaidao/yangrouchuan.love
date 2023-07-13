// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
    type InferGetStaticPropsType,
    type GetServerSidePropsContext,
    type NextPage,
} from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelpers";
import { RateAverage } from "~/components/RateAverage";

import ReviewCardWithImageModal from "~/components/ReviewCardWithImageModal";
import { toast } from "react-toastify";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePlacePage: NextPage<PageProps> = ({ id }) => {
    const { data: place, isLoading } = api.place.getById.useQuery({
        id,
    });

    if (!isLoading && !place) toast.error("データの取得に失敗しました。");

    if (!place) return <div>404</div>;
    if (!place.id) return <div>Something went wrong</div>;

    const { posts } = place;

    return (
        <>
            <Head>
                {/* TODO:文字数多い場合のためにトリミング */}
                <title>{`${place.title} |  ${SITE.title}`}</title>
            </Head>

            <Stack direction={{ md: "column", xs: "column" }}>
                <Typography variant="h2">{`${place.title}`}</Typography>
                <Typography
                    variant="h3"
                    fontSize={`1.5rem`}
                >{`${place.address}`}</Typography>
                <RateAverage posts={posts} sx={{ pt: `0.5rem` }} />
                {/* price */}

                <ReviewCardWithImageModal posts={posts} isLoading={isLoading} />
            </Stack>
        </>
    );
};

export const getStaticProps = async (
    context: GetServerSidePropsContext<{ id: string }>
) => {
    const helpers = generateSSGHelper();

    const id = context.params?.id;
    if (typeof id !== "string") throw new Error("no id");

    /*
     * Prefetching the `post.byId` query.
     * post.byId クエリのプリフェッチ。
     * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
     * prefetch は結果を返さず、例外も発生しません - その動作が必要な場合は、代わりに fetch を使用してください。
     */
    await helpers.place.getById.prefetch({ id });

    // Make sure to return { props: { trpcState: helpers.dehydrate() } }
    // 必ず { props: { trpcState: helpers.dehydrate() } } を返すようにしてください。
    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
};

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export default SinglePlacePage;
