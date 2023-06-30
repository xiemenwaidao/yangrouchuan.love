import { clerkClient } from "@clerk/nextjs";
import { type PostWithOthers } from "~/utils/types";
import { filterUserForClient } from "./filterUserForClient";
import { TRPCError } from "@trpc/server";

export const addUserDataToPosts = async <T extends PostWithOthers>(
    posts: T[]
) => {
    const users = (
        await clerkClient.users.getUserList({
            userId: posts.map((post) => post.authorId),
            limit: 100,
        })
    ).map(filterUserForClient);

    return posts.map((post) => {
        const author = users.find((user) => user.id === post.authorId);

        if (!author || !author.username)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Author for post not found",
            });

        return {
            post,
            author: {
                ...author,
                username: author.username,
            },
        };
    });
};
