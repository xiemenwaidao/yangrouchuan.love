// MUI

import { type NextPage } from "next";
import { api } from "~/utils/api";

import ReviewCardWithImageModal from "~/components/ReviewCardWithImageModal";
import Stack from "@mui/material/Stack";

const Feed = () => {
    const { data: posts, isLoading } = api.post.getAll.useQuery();

    return <ReviewCardWithImageModal posts={posts} isLoading={isLoading} />;
};

const Home: NextPage = () => {
    return (
        <Stack direction={`column`} rowGap={4}>
            <Feed />
        </Stack>
    );
};

export default Home;
