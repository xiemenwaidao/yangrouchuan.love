// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { type NextPage } from "next";
import { api } from "~/utils/api";

import ReviewCardWithImageModal from "~/components/ReviewCardWithImageModal";
import PlacesMap from "~/components/PlacesMap";

const Feed = () => {
    const { data: posts, isLoading } = api.post.getAll.useQuery();

    return <ReviewCardWithImageModal posts={posts} isLoading={isLoading} />;
};

const Home: NextPage = () => {
    return (
        <Stack direction={`column`} rowGap={4}>
            <Typography textAlign={`center`}>
                羊肉串を求める迷える仔羊たちのためのサイト
            </Typography>
            <PlacesMap />
            <Feed />
        </Stack>
    );
};

export default Home;
