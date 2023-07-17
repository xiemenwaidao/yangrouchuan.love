// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { type NextPage } from "next";
import { api } from "~/utils/api";

import ReviewCardWithImageModal from "~/components/ReviewCardWithImageModal";

const Feed = () => {
    const { data: posts, isLoading } = api.post.getAll.useQuery();

    return <ReviewCardWithImageModal posts={posts} isLoading={isLoading} />;
};

const Home: NextPage = () => {
    return (
        <Stack direction={`column`} rowGap={4}>
            <Box textAlign={`center`}>
                <Typography>
                    日本人にはまだまだ馴染みの薄い<strong>羊肉串</strong>。
                </Typography>
                <Typography>
                    ここはそんな<strong>羊肉串</strong>
                    のレビューを共有するサイトです。
                </Typography>
                <Typography>
                    集え！<strong>羊肉串</strong>愛好家たち！！
                </Typography>
            </Box>
            <Feed />
        </Stack>
    );
};

export default Home;
