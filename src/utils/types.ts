import { type Post, type Image, type Place } from "@prisma/client";
import { FrontPostSchema } from "./schema";

export interface Author {
    id: string;
    username: string;
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

export type PostWithPlaceAndAuthor = ExtendedPost<
    { place: Place; images: Image[] },
    { author: Author }
>;

export type PlaceWithPosts = Place & { posts: PostAndAuthor[] };
