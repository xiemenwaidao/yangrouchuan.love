import {
    Link as MUILink,
    type SxProps,
    type Theme,
    type TypographyProps,
} from "@mui/material";
import NextLink, { type LinkProps } from "next/link";
import { type ReactNode } from "react";

type Props = {
    nextProps: LinkProps;
    muiProps?: {
        underline?: "none" | "hover" | "always";
        color?: TypographyProps["color"];
    };
    children?: ReactNode;
    sx?: SxProps<Theme>;
};

export const MyLink = (props: Props) => {
    return (
        <NextLink href={props.nextProps.href} passHref legacyBehavior>
            <MUILink sx={props.sx} {...props.muiProps}>
                {props.children}
            </MUILink>
        </NextLink>
    );
};
