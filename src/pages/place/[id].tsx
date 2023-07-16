// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import {
    type InferGetStaticPropsType,
    type GetServerSidePropsContext,
    type NextPage,
} from "next";
import Head from "next/head";
import { MAP_DEFAULT_ZOOM, SITE } from "~/config";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssgHelpers";
import { RateAverage } from "~/components/RateAverage";

import ReviewCardWithImageModal from "~/components/ReviewCardWithImageModal";
import { toast } from "react-toastify";
import {
    GoogleMap,
    InfoWindowF,
    MarkerF,
    useLoadScript,
} from "@react-google-maps/api";
import { env } from "~/env.mjs";
import { useColorScheme } from "@mui/material/styles";
import styles from "~/utils/googlemapThemeStyles";
import { MyLink } from "~/components/parts/MyLink";
import Box from "@mui/material/Box";
import { getMapHrefByPlaceId } from "~/utils/googlemapHelpers";

interface PlaceGoogleMapProps {
    lat: number;
    lng: number;
    title: string;
    place_id: string;
}
const PlaceGoogleMap = ({ lat, lng, title, place_id }: PlaceGoogleMapProps) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const { mode } = useColorScheme();

    const position = { lat, lng };

    if (loadError) {
        toast.error("Google Mapの読み込みに失敗しました。");
        return <div>Google Mapの読み込みに失敗しました。</div>;
    }

    return (
        <Box>
            {isLoaded ? (
                <GoogleMap
                    center={position}
                    zoom={MAP_DEFAULT_ZOOM}
                    mapContainerClassName="google-map"
                    options={{
                        styles:
                            mode === "dark"
                                ? styles["night"]
                                : styles["default"],
                    }}
                >
                    <MarkerF position={position}>
                        <InfoWindowF position={position}>
                            <Box sx={{ color: "black" }}>
                                <MyLink
                                    nextProps={{
                                        href: getMapHrefByPlaceId(
                                            title,
                                            place_id
                                        ),
                                    }}
                                    target="_blank"
                                    sx={{ color: `black` }}
                                >
                                    Google Mapで開く
                                </MyLink>
                            </Box>
                        </InfoWindowF>
                    </MarkerF>
                </GoogleMap>
            ) : (
                <Skeleton
                    variant="rectangular"
                    width={`100%`}
                    sx={{
                        height: { xs: "250px", sm: "300px", md: "400px" },
                    }}
                />
            )}
        </Box>
    );
};

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

            <Stack direction={{ md: "column", xs: "column" }} gap={2}>
                <Box>
                    <Typography
                        variant="h3"
                        color={`primary.main`}
                        fontSize={`2rem`}
                    >{`${place.title}`}</Typography>
                    <Typography variant="subtitle1">{`${place.address}`}</Typography>
                    <RateAverage posts={posts} sx={{ pt: `0.5rem` }} />
                    {/* price */}
                </Box>

                <PlaceGoogleMap
                    lat={place.lat}
                    lng={place.lng}
                    title={place.title}
                    place_id={place.id}
                />

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
