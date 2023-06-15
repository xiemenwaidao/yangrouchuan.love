import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SITE } from "~/config";

export const Header = () => {
    const { user } = useUser();

    return (
        <header className="flex justify-between  p-4">
            <div className="flex gap-4">
                <Link href={`/`}>
                    <h1 className="font-bold">{SITE.title}</h1>
                </Link>
                <Link href={`/post`}>post</Link>
            </div>
            {user ? <SignOutButton /> : <SignInButton />}
        </header>
    );
};
