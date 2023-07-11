import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import PostForm from "~/components/form/PostFrom";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { imageUrl } from "~/utils/cloudflareHelpers";
import { type FrontPostSchema } from "~/utils/schema";
import { generateSSGHelper } from "~/utils/ssgHelpers";

const PostEditPage = ({ id }: { id: string }) => {
    const { data } = api.post.getById.useQuery({
        id,
    });

    if (!data) return <div>...loading</div>;

    const { post } = data;

    const imageObjArray = {
        urls: post.images.map((image) => imageUrl(image.id)),
    };

    const formValues: FrontPostSchema = {
        rating: post.rating,
        content: post.content,
        images: post.images.map((image) => image.id),
        address: post.place.address,
        price: post.price === null ? undefined : post.price,
    };

    return (
        <>
            <Head>
                <title>{`投稿編集 | ${SITE.title}`}</title>
            </Head>
            <h2>編集</h2>

            <PostForm defaultValues={formValues} />
        </>
    );
};

export const getStaticProps = async (
    context: GetServerSidePropsContext<{ id: string }>
) => {
    const helpers = generateSSGHelper();

    const id = context.params?.id;
    if (typeof id !== "string") throw new Error("no slug");

    /*
     * Prefetching the `post.byId` query.
     * post.byId クエリのプリフェッチ。
     * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
     * prefetch は結果を返さず、例外も発生しません - その動作が必要な場合は、代わりに fetch を使用してください。
     */
    await helpers.post.getById.prefetch({ id });

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

export default PostEditPage;
