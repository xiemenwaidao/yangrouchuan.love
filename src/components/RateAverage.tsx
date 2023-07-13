import { type PostAndAuthor } from "~/utils/types";
import { IconContainer, StyledRating, customIcons } from "./parts/StyledRating";
import { type SxProps, type Theme } from "@mui/material/styles";

interface Props {
    posts: PostAndAuthor[];
    sx?: SxProps<Theme>;
}

export const RateAverage = ({ posts, sx }: Props) => {
    const rateAverage =
        posts.length !== 0
            ? Math.round(
                  posts.reduce((acc, cur) => {
                      return acc + cur.post.rating;
                  }, 0) / posts.length
              )
            : 2;

    return (
        <StyledRating
            name="highlight-selected-only"
            value={rateAverage}
            IconContainerComponent={IconContainer}
            getLabelText={(value: number) => customIcons[value]?.label ?? ""}
            highlightSelectedOnly
            readOnly
            sx={sx}
        />
    );
};
