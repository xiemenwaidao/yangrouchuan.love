import MUILink from "@mui/material/Link";
import { type TypographyProps } from "@mui/material/Typography";
import { type SxProps, type Theme } from "@mui/material/styles";
import NextLink, { type LinkProps } from "next/link";
import { type HTMLAttributeAnchorTarget, type ReactNode } from "react";

type Props = {
    nextProps: LinkProps;
    muiProps?: {
        underline?: "none" | "hover" | "always";
        color?: TypographyProps["color"];
    };
    children?: ReactNode;
    sx?: SxProps<Theme>;
    target?: HTMLAttributeAnchorTarget;
};

export const MyLink = (props: Props) => {
    return (
        <NextLink href={props.nextProps.href} passHref legacyBehavior>
            <MUILink sx={props.sx} {...props.muiProps} target={props.target}>
                {props.children}
            </MUILink>
        </NextLink>
    );
};
