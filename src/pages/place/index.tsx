import { type NextPage } from "next";
import Head from "next/head";
import { SITE } from "~/config";

const Place: NextPage = () => {
    return (
        <>
            <Head>
                <title>{`Place | ${SITE.title}`}</title>
            </Head>
            <div>🚧開発中</div>
        </>
    );
};

export default Place;
