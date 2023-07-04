import { type NextPage } from "next";
import { api } from "~/utils/api";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
    Avatar,
    AvatarGroup,
    Box,
    CardActionArea,
    CardHeader,
    Grid,
    IconButton,
    Skeleton,
    Stack,
} from "@mui/material";
import { type PostAndAuthor } from "~/utils/types";
import { imageUrl } from "~/utils/cloudflareHelpers";
import NextImage from "next/image";
import Link from "next/link";
import { type Place } from "@prisma/client";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    IconContainer,
    StyledRating,
    customIcons,
} from "~/components/parts/StyledRating";

dayjs.extend(relativeTime);

type PlaceWithPosts = Place & { posts: PostAndAuthor[] };

interface PostFeedViewProps {
    place: PlaceWithPosts;
}

const RecipeReviewCard = (props: PostFeedViewProps) => {
    const { place } = props;
    const { posts } = place;

    const imageId = posts[0]?.post?.images[0]?.id;
    // 一応postsが0の場合を考慮
    const rateAverage =
        posts.length !== 0
            ? Math.round(
                  posts.reduce((acc, cur) => {
                      return acc + cur.post.rating;
                  }, 0) / posts.length
              )
            : 2;

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
                            <StyledRating
                                name="highlight-selected-only"
                                value={rateAverage}
                                IconContainerComponent={IconContainer}
                                getLabelText={(value: number) =>
                                    customIcons[value]?.label ?? ""
                                }
                                highlightSelectedOnly
                                readOnly
                            />
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
            {/* <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions> */}
        </Card>
    );
};

const Feed = () => {
    const { data, isLoading: postLoading } = api.place.getAll.useQuery();

    // if (!data) return <div>Something went wrong</div>;

    console.log({ data });

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
            {data?.map((place) => (
                <Grid item xs={2} sm={4} md={4} key={place.id}>
                    {/* <PostFeedView place={place} /> */}
                    <RecipeReviewCard place={place} />
                </Grid>
            ))}
        </Grid>
    );
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
