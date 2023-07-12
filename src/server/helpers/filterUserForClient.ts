import type { User } from "@clerk/nextjs/dist/types/server";

export const filterUserForClient = (user: User) => {
    if (!user.username) throw new Error("User does not have a username");

    return {
        id: user.id,
        username: user.username,
        profilePicture: user.profileImageUrl,
    };
};
