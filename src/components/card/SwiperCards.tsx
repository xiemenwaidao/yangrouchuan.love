import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const SwiperCards = () => {
    return (
        <Box maxWidth={"100%"}>
            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                style={{ padding: "10px" }}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <SwiperSlide
                        key={i}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{ width: "100%", height: 128 }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default SwiperCards;
