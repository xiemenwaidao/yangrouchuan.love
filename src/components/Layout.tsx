import type { PropsWithChildren } from "react";
import Header from "./Header";

export const Layout = (props: PropsWithChildren) => {
    return (
        <>
            <Header />
            <main className="">{props.children}</main>
        </>
    );
};
