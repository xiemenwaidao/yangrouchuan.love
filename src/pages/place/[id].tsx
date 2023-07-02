import {
    type InferGetStaticPropsType,
    type GetServerSidePropsContext,
    type NextPage,
} from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelpers";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePlacePage: NextPage<PageProps> = ({ id }) => {
    const { data } = api.place.getById.useQuery({
        id,
    });

    if (!data) return <div>404</div>;
    if (!data.id) return <div>Something went wrong</div>;

    return (
        <>
            <Head>
                {/* TODO:文字数多い場合のためにトリミング */}
                <title>{`${data.title} |  ${SITE.title}`}</title>
            </Head>

            <div>{`${data.address}`}</div>
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
