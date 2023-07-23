// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { type NextPage } from "next";
import { api } from "~/utils/api";

import ReviewCardWithImageModal from "~/components/card/ReviewCardWithImageModal";
import PlacesMap from "~/components/PlacesMap";

const Feed = () => {
    const { data: posts, isLoading } = api.post.getAll.useQuery();

    return <ReviewCardWithImageModal posts={posts} isLoading={isLoading} />;
};

const Home: NextPage = () => {
    return (
        <Stack direction={`column`} rowGap={4}>
            <Typography textAlign={`center`} fontStyle={`italic`}>
                {/* 羊肉串を求めて迷える仔羊たちのためのサイト */}
                羊肉串愛好家のための羅針盤
                <br />
                あなたの最高の串を見つけるためのサイト
            </Typography>
            <PlacesMap />
            <Feed />
        </Stack>
    );
};

export default Home;
