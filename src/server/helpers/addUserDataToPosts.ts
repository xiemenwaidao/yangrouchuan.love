import { clerkClient } from "@clerk/nextjs";
import { type PostWithOthers } from "~/utils/types";
import { filterUserForClient } from "./filterUserForClient";
import { TRPCError } from "@trpc/server";
import { User } from "@clerk/nextjs/dist/types/server";

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

        if (!author || !author.username) {
            const dammyAuthor = {
                id: null,
                username: null,
                profilePicture: null,
            };

            return {
                post,
                author: {
                    ...dammyAuthor,
                },
            };
        }

        return {
            post,
            author: {
                ...author,
                username: author.username,
            },
        };
    });
};
