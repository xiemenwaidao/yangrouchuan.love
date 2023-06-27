import Box from "@mui/material/Box";
import MUIRating from "@mui/material/Rating";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { type Control, Controller } from "react-hook-form";
import { type FrontPostSchema } from "~/utils/schema";
import { FormControl, FormHelperText } from "@mui/material";

const labels: { [index: string]: string } = {
    0.5: "🤮",
    1: "🤢",
    1.5: "😩",
    2: "😕",
    2.5: "😐",
    3: "🙂",
    3.5: "😃",
    4: "😄",
    4.5: "😆",
    5: "😍",
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
        <Controller
            name="rating"
            control={props.controle}
            defaultValue={2.5}
            render={({ field, fieldState }) => (
                <FormControl error={fieldState.invalid}>
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

                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    );
};
