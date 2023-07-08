import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

import NextImage from "next/image";
import ReviewCard from "./ReviewCard";
import { useCallback, useState } from "react";
import { type PostWithPlaceAndAuthor, type PostAndAuthor } from "~/utils/types";

interface ReviewCardWithImageModalProps {
    posts: PostAndAuthor[] | PostWithPlaceAndAuthor[];
}

const ReviewCardWithImageModal = ({ posts }: ReviewCardWithImageModalProps) => {
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
        <Stack gap={2} mt={4}>
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
        </Stack>
    );
};

export default ReviewCardWithImageModal;
