// MUI
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

import { type NextPage } from "next";
import { api } from "~/utils/api";

import PlaceFeed from "~/components/PlaceFeed";
import { toast } from "react-toastify";

const Feed = () => {
    const { data, isLoading: postLoading } = api.place.getAll.useQuery();

    if (!data) {
        // toast.error("データの取得に失敗しました。");
    }

    console.log({ data });

    return <PlaceFeed places={data} postLoading={postLoading} />;
};

const Home: NextPage = () => {
    return (
        <Grid container direction={`column`} rowGap={4}>
            <Grid item>
                <Skeleton variant="rectangular" width={`100%`} height={400} />
            </Grid>
            <Grid item>
                <Feed />
            </Grid>
        </Grid>
    );
};

export default Home;
