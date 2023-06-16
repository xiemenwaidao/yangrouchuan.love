import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SITE } from "~/config";
import { ThemeButton } from "./ThemeButton";

export const Header = () => {
    const { user } = useUser();

    return (
        <header className="flex justify-between  p-4">
            <div className="flex gap-4">
                <Link href={`/`}>
                    <h1 className="font-bold">{SITE.title}</h1>
                </Link>
                {user && <Link href={`/post/new`}>new post</Link>}
            </div>
            <div className="flex gap-4">
                <ThemeButton />
                {user ? (
                    <UserButton afterSignOutUrl={`localhost:300`} />
                ) : (
                    <SignInButton />
                )}
            </div>
        </header>
    );
};
