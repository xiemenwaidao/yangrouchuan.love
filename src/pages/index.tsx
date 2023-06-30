import CircularProgress from "@mui/material/CircularProgress";
import { type NextPage } from "next";
import { api } from "~/utils/api";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";
import { type PostWithPlaceAndImages } from "~/utils/types";
import { imageUrl } from "~/utils/cloudflareHelpers";
import Image from "next/image";
import Link from "next/link";

interface PostFeedViewProps {
    post: PostWithPlaceAndImages;
    author: {
        username: string;
        id: string;
        profilePicture: string;
    };
}

const PostFeedView = (props: PostFeedViewProps) => {
    return (
        <Card sx={{ maxWidth: "100%" }}>
            <Link href={`/show/${props.post.id}`}>
                <CardActionArea>
                    <Image
                        src={
                            props.post.images[0]?.id
                                ? imageUrl(props.post.images[0].id)
                                : "https://picsum.photos/200"
                        }
                        height={140}
                        width={140}
                        alt={props.post.place.title}
                        style={{ objectFit: "cover", width: "100%" }}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.post.place.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.post.content}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
};

const Feed = () => {
    const { data, isLoading: postLoading } = api.post.getAll.useQuery();
    if (postLoading) return <CircularProgress />;
    if (!data) return <div>Something went wrong</div>;

    console.log({ data });

    return (
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
        >
            {data.map((post) => (
                <Grid item xs={2} sm={4} md={4} key={post.post.id}>
                    <PostFeedView {...post} />
                </Grid>
            ))}
        </Grid>
    );
};

const Home: NextPage = () => {
    return <Feed />;
};

export default Home;
