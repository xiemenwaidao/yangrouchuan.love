import CircularProgress from "@mui/material/CircularProgress";
import { type NextPage } from "next";
import { api } from "~/utils/api";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";
import { type ExtendedPost } from "~/utils/types";
import { imageUrl } from "~/utils/cloudflareHelpers";
import NextImage from "next/image";
import Link from "next/link";
import { type Place, type Image } from "@prisma/client";

type PostAndAuthor = ExtendedPost<
    { images: Image[] },
    { author: { username: string; id: string; profilePicture: string } }
>;
type PlaceWithPosts = Place & { posts: PostAndAuthor[] };

interface PostFeedViewProps {
    place: PlaceWithPosts;
}

// TODO postじゃなくてplace基準でデータ取得
const PostFeedView = (props: PostFeedViewProps) => {
    const { place } = props;
    const imageId = place.posts[0]?.post?.images[0]?.id;

    return (
        <Card sx={{ maxWidth: "100%" }}>
            <Link href={`/place/${place.id}`}>
                <CardActionArea>
                    <NextImage
                        src={
                            imageId
                                ? imageUrl(imageId)
                                : "https://picsum.photos/200"
                        }
                        height={140}
                        width={140}
                        alt={place.title}
                        style={{ objectFit: "cover", width: "100%" }}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {place.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {place.address}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
};

const Feed = () => {
    const { data, isLoading: postLoading } = api.place.getAll.useQuery();
    if (postLoading) return <CircularProgress />;
    if (!data) return <div>Something went wrong</div>;

    console.log({ data });

    return (
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
        >
            {data.map((place) => (
                <Grid item xs={2} sm={4} md={4} key={place.id}>
                    <PostFeedView place={place} />
                </Grid>
            ))}
        </Grid>
    );
};

const Home: NextPage = () => {
    return <Feed />;
};

export default Home;
