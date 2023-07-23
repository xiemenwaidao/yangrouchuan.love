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
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { type PostWithPlaceAndAuthor, type PostAndAuthor } from "~/utils/types";
import { imageUrl } from "~/utils/cloudflareHelpers";
import NextImage from "next/image";
import NextLink from "next/link";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useUser } from "@clerk/nextjs";
import { type Place } from "@prisma/client";
import { MyLink } from "../parts/MyLink";
import { useRouter } from "next/router";
import Tooltip from "@mui/material/Tooltip";

interface MenuButtonProps {
    postId: string;
}

const MenuButton = ({ postId }: MenuButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-label="settings"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                    position: "absolute",
                    top: { xs: "8px", sm: "4px" },
                    right: { xs: "8px", sm: "4px" },
                    zIndex: 10,
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={handleClose}>
                    <NextLink href={`/edit/${postId}`}>編集</NextLink>
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>削除</MenuItem> */}
            </Menu>
        </>
    );
};

interface PlaceDetailProps {
    place: Place;
}

const PlaceDetail = ({ place }: PlaceDetailProps) => {
    return (
        <MyLink
            nextProps={{
                href: `/place/${place.id}`,
            }}
            muiProps={{ underline: "hover" }}
            sx={{
                display: "block",
                mb: "8px",
                width: "fit-content",
            }}
        >
            <Typography variant="h5" fontWeight={"bold"}>
                {place.title}
            </Typography>
            <Typography>{place.address}</Typography>
        </MyLink>
    );
};

interface ReviewCardProps {
    post: PostAndAuthor | PostWithPlaceAndAuthor;
    handleImageClick: (url: string) => void;
}

const ReviewCard = ({ post, handleImageClick }: ReviewCardProps) => {
    const { user } = useUser();

    // 現在のURLパスを取得
    const router = useRouter();
    const currentPath = router.pathname.split("/")[1];

    const itemPost = post.post;
    const { images } = itemPost;
    const { author } = post;

    const isUserPage = currentPath === "user";
    const isYourPost = user?.id === author.id;

    return (
        <Card
            sx={{
                display: { sm: "grid" },
                gridTemplateColumns: { sm: "240px 1fr" },
                height: { sm: "240px" },
                borderRadius: "8px",
                position: "relative",
            }}
        >
            {isYourPost && <MenuButton postId={itemPost.id} />}
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
                                    sizes="(max-width: 900px) 100px, 240px"
                                    onClick={() => handleImageClick(url)}
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                    overflowY: "auto",
                    p: 2,
                }}
            >
                <Box>
                    {"place" in itemPost && (
                        <PlaceDetail place={itemPost.place} />
                    )}
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
                            {itemPost.price &&
                                itemPost.skewerCount &&
                                `¥${itemPost.price}/${itemPost.skewerCount}本`}
                        </Typography>
                    </Box>
                    <Typography sx={{ py: 1 }}>{itemPost.content}</Typography>
                </Box>
                {!isUserPage && (
                    <Box display={"flex"} gap={1} mr={0} ml={"auto"}>
                        {author.username !== null &&
                        author.profilePicture !== null ? (
                            <NextLink href={`/user/@${author.username}/`}>
                                <Avatar aria-label="recipe">
                                    <NextImage
                                        src={author.profilePicture}
                                        alt={`@${author.username}のプロフィール写真`}
                                        fill
                                        sizes="64px"
                                        style={{
                                            objectFit: "cover",
                                        }}
                                    />
                                </Avatar>
                            </NextLink>
                        ) : (
                            <Tooltip title="退会したユーザー">
                                <Avatar aria-label="recipe"></Avatar>
                            </Tooltip>
                        )}
                    </Box>
                )}
            </Box>
        </Card>
    );
};

export default ReviewCard;
