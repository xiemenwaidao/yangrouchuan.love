import Box from "@mui/material/Box";
import MUIRating from "@mui/material/Rating";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { type Control, Controller } from "react-hook-form";
import { type FrontPostSchema } from "~/utils/schema";

const labels: { [index: string]: string } = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
};

function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${
        labels[value] ?? "unknown"
    }`;
}

interface Props {
    controle: Control<FrontPostSchema>;
}

export const Rating = (props: Props) => {
    const [hover, setHover] = useState(-1);

    return (
        <Box
            sx={
                {
                    // width: 200,
                    // display: "flex",
                    // alignItems: "center",
                }
            }
        >
            <Controller
                name="rating"
                control={props.controle}
                defaultValue={2.5}
                render={({ field, fieldState }) => (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <MUIRating
                                {...field}
                                name="hover-feedback"
                                precision={0.5}
                                value={Number(field.value)}
                                getLabelText={getLabelText}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={
                                    <StarIcon
                                        style={{ opacity: 0.55 }}
                                        fontSize="inherit"
                                    />
                                }
                            />
                            {field.value !== null && (
                                <Box sx={{ ml: 2 }}>
                                    {labels[hover !== -1 ? hover : field.value]}
                                </Box>
                            )}
                        </Box>
                        {fieldState.invalid && (
                            <Box sx={{ color: "error.main" }}>
                                {fieldState.error?.message}
                            </Box>
                        )}
                    </>
                )}
            />
        </Box>
    );
};
