import { type Post, type Image } from "@prisma/client";

export interface Author {
    username: string;
    id: string;
    profilePicture: string;
}

export type PostWithOthers<AdditionalFields = Record<string, unknown>> = Post &
    AdditionalFields;

export type ExtendedPost<
    AdditionalFields = Record<string, unknown>,
    AdditionalObjects = Record<string, unknown>
> = {
    post: PostWithOthers<AdditionalFields>;
} & AdditionalObjects;

export type PostAndAuthor = ExtendedPost<
    { images: Image[] },
    { author: Author }
>;
