import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const ReviewCardSkeleton = () => {
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
            <Skeleton
                variant="rectangular"
                width={`calc(100% - 16px)`}
                sx={{
                    height: { xs: "200px", sm: "calc(100% - 16px)" },
                    margin: "8px",
                    borderRadius: "8px",
                }}
            />
            <CardContent
                sx={{
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                    overflowY: "auto",
                    gap: "6px",
                }}
            >
                <Stack gap={"4px"}>
                    <Skeleton
                        variant="text"
                        width={"50%"}
                        sx={{ fontSize: "1rem" }}
                    />
                    <Skeleton
                        variant="text"
                        width={"60%"}
                        sx={{ fontSize: "1rem" }}
                    />
                    <Stack
                        direction={`row`}
                        // fontSize={`24px`}
                    >
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="circular"
                                width={`1em`}
                                height={`1em`}
                                sx={{ margin: "4px" }}
                            />
                        ))}
                    </Stack>
                    <Skeleton
                        variant="text"
                        width={"70%"}
                        sx={{ fontSize: "1rem" }}
                    />
                    <Skeleton
                        variant="rounded"
                        width={`100%`}
                        height={`2.5rem`}
                    />
                </Stack>
                <Box display={"flex"} gap={1} mr={0} ml={"auto"}>
                    <Skeleton variant="circular">
                        <Avatar />
                    </Skeleton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReviewCardSkeleton;
