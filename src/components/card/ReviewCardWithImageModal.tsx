import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import NextImage from "next/image";
import ReviewCard from "./ReviewCard";
import { useCallback, useState } from "react";
import { type PostWithPlaceAndAuthor, type PostAndAuthor } from "~/utils/types";
import ReviewCardSkeleton from "./ReviewCardSkeleton";

interface ReviewCardWithImageModalProps {
    posts: PostAndAuthor[] | PostWithPlaceAndAuthor[] | undefined;
    isLoading: boolean;
}

const ReviewCardWithImageModal = ({
    posts,
    isLoading,
}: ReviewCardWithImageModalProps) => {
    const [open, setOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    const handleClick = useCallback((url: string) => {
        setModalImage(url);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <Stack gap={2}>
            {isLoading || posts === undefined || posts.length === 0 ? (
                isLoading || posts === undefined ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <ReviewCardSkeleton key={i} />
                    ))
                ) : (
                    // 投稿が0の場合
                    <Box textAlign={`center`} p={2}>
                        <Typography>投稿0🥲</Typography>
                    </Box>
                )
            ) : (
                <>
                    {posts.map((post) => (
                        <ReviewCard
                            key={post.post.id}
                            handleImageClick={handleClick}
                            post={post}
                        />
                    ))}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        closeAfterTransition
                    >
                        <Fade in={open} timeout={500}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "90%",
                                    height: "90%",
                                }}
                            >
                                {modalImage && (
                                    <NextImage
                                        fill
                                        src={modalImage}
                                        alt={""}
                                        style={{ objectFit: "contain" }}
                                        onClick={handleClose}
                                    />
                                )}
                            </Box>
                        </Fade>
                    </Modal>
                </>
            )}
        </Stack>
    );
};

export default ReviewCardWithImageModal;
