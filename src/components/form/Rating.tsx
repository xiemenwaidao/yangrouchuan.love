import Box from "@mui/material/Box";
import MUIRating, { type IconContainerProps } from "@mui/material/Rating";
import { type ReactElement } from "react";
import { type Control, Controller } from "react-hook-form";
import { type FrontPostSchema } from "~/utils/schema";
import { FormControl, FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

const StyledRating = styled(MUIRating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
        color: theme.palette.action.disabled,
    },
}));

const customIcons: {
    [index: string]: {
        icon: ReactElement;
        label: string;
    };
} = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: "Very Dissatisfied",
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: "Dissatisfied",
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: "Neutral",
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: "Satisfied",
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: "Very Satisfied",
    },
};

function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value]?.icon}</span>;
}

interface Props {
    controle: Control<FrontPostSchema>;
}

export const Rating = (props: Props) => {
    return (
        <Controller
            name="rating"
            control={props.controle}
            defaultValue={2.5}
            render={({ field, fieldState }) => (
                <FormControl error={fieldState.invalid}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StyledRating
                            {...field}
                            name="highlight-selected-only"
                            defaultValue={2}
                            value={Number(field.value)}
                            IconContainerComponent={IconContainer}
                            getLabelText={(value: number) =>
                                customIcons[value]!.label
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
