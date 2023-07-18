import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PostForm from "~/components/form/PostFrom";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { type FrontPostSchemaOmitId } from "~/utils/schema";
import { generateSSGHelper } from "~/utils/ssgHelpers";

const PostEditPage = ({ id }: { id: string }) => {
    const { data } = api.post.getById.useQuery({
        id,
    });
    const [formValues, setFormValues] = useState<
        FrontPostSchemaOmitId & { id: string; placeId: string }
    >();

    useEffect(() => {
        if (data) {
            const { post } = data;
            const newFormValues: FrontPostSchemaOmitId & {
                id: string;
                placeId: string;
            } = {
                id: post.id,
                rating: post.rating,
                content: post.content,
                images: post.images.map((image) => image.id),
                address: post.place.address,
                placeId: post.place.id,
                price: post.price === null ? undefined : post.price,
                skewerCount:
                    post.skewerCount === null ? undefined : post.skewerCount,
            };
            setFormValues(newFormValues);
        }
    }, [data]);

    if (!data) return <div>...loading</div>;

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
        // revalidate: 60,
    };
};

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export default PostEditPage;
