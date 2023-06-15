import type { PropsWithChildren } from "react";
import { Header } from "./Header";

export const Layout = (props: PropsWithChildren) => {
    return (
        <>
            <Header />
            <main className="p-4">{props.children}</main>
        </>
    );
};
