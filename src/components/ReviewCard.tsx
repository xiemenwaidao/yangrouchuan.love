import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import {
    IconContainer,
    StyledRating,
    customIcons,
} from "~/components/parts/StyledRating";
import dayjs from "dayjs";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import { type PostAndAuthor } from "~/utils/types";
import { imageUrl } from "~/utils/cloudflareHelpers";
import NextImage from "next/image";
import NextLink from "next/link";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface ReviewCardProps {
    post: PostAndAuthor;
    handleImageClick: (url: string) => void;
}

const ReviewCard = ({ post, handleImageClick }: ReviewCardProps) => {
    const itemPost = post.post;
    const { images } = itemPost;
    const { author } = post;

    return (
        <Card
            sx={{
                display: { sm: "grid" },
                gridTemplateColumns: { sm: "240px 1fr" },
                height: { sm: "240px" },
            }}
        >
            <Box height={{ xs: "200px", sm: "100%" }}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    style={{
                        width: "100%",
                        height: "100%",
                        padding: "8px",
                    }}
                >
                    {images.map((image) => {
                        const url = imageUrl(image.id);

                        return (
                            <SwiperSlide
                                key={image.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <NextImage
                                    src={url}
                                    alt={""}
                                    fill
                                    style={{
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: "8px",
                                    }}
                                    sizes="100%"
                                    onClick={() => handleImageClick(url)}
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Box>
            <CardContent
                sx={{
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                    overflowY: "auto",
                }}
            >
                <Box>
                    <StyledRating
                        name="highlight-selected-only"
                        value={itemPost.rating}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value: number) =>
                            customIcons[value]?.label ?? ""
                        }
                        highlightSelectedOnly
                        readOnly
                    />
                    <Box display={"flex"} gap={1}>
                        <Typography color="text.secondary">
                            {dayjs(itemPost.updatedAt).format("YYYY/MM/DD")}
                        </Typography>
                        <Typography color="text.secondary">
                            {itemPost.price && `¥${itemPost.price}くらい`}
                        </Typography>
                    </Box>
                    <Typography sx={{ py: 1 }}>{itemPost.content}</Typography>
                </Box>
                <Box display={"flex"} gap={1} mr={0} ml={"auto"}>
                    <Typography alignSelf={"center"}>by</Typography>
                    <NextLink href={`/user/@${author.username}/`}>
                        <Avatar aria-label="recipe">
                            <NextImage
                                src={author.profilePicture}
                                alt={`@${author.username}のプロフィール写真`}
                                width={64}
                                height={64}
                                style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        </Avatar>
                    </NextLink>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReviewCard;
