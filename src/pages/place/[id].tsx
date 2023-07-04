import { type Image } from "@prisma/client";
import {
    type InferGetStaticPropsType,
    type GetServerSidePropsContext,
    type NextPage,
} from "next";
import Head from "next/head";
import { SITE } from "~/config";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelpers";
import NextImage from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { imageUrl } from "~/utils/cloudflareHelpers";
import { CardActionArea } from "@mui/material";
import { MyLink } from "~/components/MyLink";

interface ImageGalleryProps {
    imageWithAuthor: {
        author: {
            username: string;
            id: string;
            profilePicture: string;
        };
        id: string;
        postId: string;
    }[];
}

const ImageGallery = ({ imageWithAuthor }: ImageGalleryProps) => {
    return (
        <ImageList
            sx={{ width: "100%", maxHeight: 450, gridTemplateRows: "160px" }}
            cols={3}
            gap={8}
        >
            {/* <ImageListItem key="Subheader" cols={3}>
                <ListSubheader component="div">December</ListSubheader>
            </ImageListItem> */}
            {imageWithAuthor.map((image) => (
                <ImageListItem key={image.id}>
                    <CardActionArea
                        sx={{
                            position: "relative",
                            height: "160px",
                            width: "100%",
                        }}
                    >
                        <NextImage
                            src={`${imageUrl(image.id)}`}
                            alt={``}
                            loading="lazy"
                            fill
                            sizes="100%"
                            style={{
                                objectFit: "cover",
                            }}
                        />
                    </CardActionArea>
                    <ImageListItemBar
                        // title={`by @${image.author.username}`}
                        title={
                            <MyLink
                                nextProps={{
                                    href: `/user/@${image.author.username}`,
                                }}
                            >
                                {`by @${image.author.username}`}
                            </MyLink>
                        }
                        // subtitle={``}
                        // actionIcon={
                        //     <IconButton
                        //         sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        //         aria-label={`info about ${"title"}`}
                        //     >
                        //         <InfoIcon />
                        //     </IconButton>
                        // }
                    />
                </ImageListItem>
            ))}
        </ImageList>
        // </Box>
    );
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePlacePage: NextPage<PageProps> = ({ id }) => {
    const { data: place, isLoading } = api.place.getById.useQuery({
        id,
    });

    if (!place) return <div>404</div>;
    if (!place.id) return <div>Something went wrong</div>;

    const { posts } = place;
    const imageWithAuthor = posts
        .map((post) => {
            return post.post.images.map((image) => {
                return { ...image, author: post.author };
            });
        })
        .flat();

    return (
        <>
            <Head>
                {/* TODO:文字数多い場合のためにトリミング */}
                <title>{`${place.title} |  ${SITE.title}`}</title>
            </Head>

            <div>{`${place.address}`}</div>
            <ImageGallery imageWithAuthor={imageWithAuthor} />
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
