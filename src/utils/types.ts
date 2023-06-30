import { type Place, type Post, type Image } from "@prisma/client";

export interface PostWithPlaceAndImages extends Post {
    place: Place;
    images: Image[];
}
