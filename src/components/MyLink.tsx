import { Link as MUILink, type TypographyProps } from "@mui/material";
import NextLink, { type LinkProps } from "next/link";
import { type ReactNode } from "react";

type Props = {
    nextProps: LinkProps;
    muiProps?: {
        underline?: "none" | "hover" | "always";
        color?: TypographyProps["color"];
    };
    children?: ReactNode;
};

export const MyLink = (props: Props) => {
    return (
        <NextLink href={props.nextProps.href} passHref legacyBehavior>
            <MUILink {...props.muiProps}>{props.children}</MUILink>
        </NextLink>
    );
};
