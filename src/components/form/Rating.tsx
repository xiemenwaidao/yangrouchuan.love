import Box from "@mui/material/Box";
import { type Control, Controller } from "react-hook-form";
import { type FrontPostSchema } from "~/utils/schema";
import { FormControl, FormHelperText } from "@mui/material";
import {
    IconContainer,
    StyledRating,
    customIcons,
} from "../parts/StyledRating";

interface Props {
    controle: Control<FrontPostSchema>;
}

export const Rating = (props: Props) => {
    return (
        <Controller
            name="rating"
            control={props.controle}
            defaultValue={3}
            render={({ field, fieldState }) => (
                <FormControl error={fieldState.invalid}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StyledRating
                            {...field}
                            name="highlight-selected-only"
                            // defaultValue={2}
                            value={Number(field.value)}
                            IconContainerComponent={IconContainer}
                            getLabelText={(value: number) =>
                                customIcons[value]?.label ?? ""
                            }
                            highlightSelectedOnly
                        />
                    </Box>

                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    );
};
