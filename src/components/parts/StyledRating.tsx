import { styled } from "@mui/material/styles";
import Rating, { type IconContainerProps } from "@mui/material/Rating";
import { type ReactElement } from "react";

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

export const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
        color: theme.palette.action.disabled,
    },
}));

export const customIcons: {
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

export const IconContainer = (props: IconContainerProps) => {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value]?.icon}</span>;
};