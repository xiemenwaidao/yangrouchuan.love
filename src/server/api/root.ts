import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { cloudflareImagesRouter } from "./routers/cloudflareImages";
import { placeRouter } from "./routers/place";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    place: placeRouter,
    user: userRouter,
    cloudflareImages: cloudflareImagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
