import type { NextPage } from "next";
import Head from "next/head";
import { SITE } from "~/config";
import PostForm from "~/components/form/PostFrom";

const Create: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`新規投稿 | ${SITE.title}`}</title>
            </Head>
            <h2>新規投稿</h2>

            <PostForm />
        </>
    );
};

export default Create;
