// MUI
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

import Link from "next/link";
import NextImage from "next/image";
import { type PlaceWithPosts } from "~/utils/types";
import { imageUrl } from "~/utils/cloudflareHelpers";
import { RateAverage } from "./RateAverage";
import dayjs from "./RelativeDayJs";

interface PostFeedViewProps {
    place: PlaceWithPosts;
}

const RecipeReviewCard = ({ place }: PostFeedViewProps) => {
    const { posts } = place;

    const imageId = posts[0]?.post?.images[0]?.id;
    // 一応postsが0の場合を考慮

    return (
        <Card sx={{ maxWidth: "100%", position: "relative" }}>
            <IconButton
                aria-label="settings"
                onClick={() => console.log("clicked MoreVertIcon")}
                sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
            >
                <MoreVertIcon />
            </IconButton>
            <Link href={`/place/${place.id}/`}>
                <CardActionArea
                    onClick={() => console.log("clicked CardActionArea")}
                >
                    <CardHeader
                        title={place.title}
                        subheader={`last updated ${dayjs(
                            place.updatedAt
                        ).fromNow()}`}
                    />
                    <CardContent
                        sx={{ height: "194px", overflow: "hidden", p: 0 }}
                    >
                        <NextImage
                            src={
                                imageId
                                    ? imageUrl(imageId)
                                    : "https://picsum.photos/200"
                            }
                            width={300}
                            height={300}
                            alt={`${place.title}`}
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </CardContent>
                    <CardContent sx={{ display: "grid", gap: "8px" }}>
                        <Typography variant="body2" color="text.secondary">
                            {place.address}
                        </Typography>
                        <Box>
                            <RateAverage posts={posts} />
                        </Box>
                        <AvatarGroup max={3}>
                            {posts.map((post) => (
                                <Avatar
                                    key={post.author.id}
                                    // sx={{ bgcolor: red[500] }}
                                    aria-label="recipe"
                                >
                                    <NextImage
                                        src={post.author.profilePicture}
                                        alt={""}
                                        width={64}
                                        height={64}
                                        style={{
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </Avatar>
                            ))}
                        </AvatarGroup>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
};

interface PlaceFeedProps {
    places: PlaceWithPosts[] | undefined;
    postLoading: boolean;
}

const PlaceFeed = ({ places, postLoading }: PlaceFeedProps) => {
    return postLoading ? (
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
        >
            <Grid item xs={2} sm={4} md={4}>
                <Skeleton
                    variant="rectangular"
                    width={`100%`}
                    height={441.55}
                />
            </Grid>
        </Grid>
    ) : (
        <Grid
            container
            item
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
        >
            {places?.map((place) => (
                <Grid item xs={2} sm={4} md={4} key={place.id}>
                    <RecipeReviewCard place={place} />
                </Grid>
            ))}
        </Grid>
    );
};

export default PlaceFeed;
