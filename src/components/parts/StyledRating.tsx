// MUI
import { styled } from "@mui/material/styles";
import Rating, { type IconContainerProps } from "@mui/material/Rating";
// MUI Icons
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

import { type ReactElement } from "react";

export const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
        color: theme.vars.palette.action.disabled,
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
        label: "不満",
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: "ちょっと不満",
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: "普通",
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: "満足",
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: "大満足",
    },
};

export const IconContainer = (props: IconContainerProps) => {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value]?.icon}</span>;
};
