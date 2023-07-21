import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ERROR_USER_NOT_FOUND } from "~/config";
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const userRouter = createTRPCRouter({
    getUserByUsername: publicProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ input }) => {
            const [user] = await clerkClient.users.getUserList({
                username: [input.username],
            });

            if (!user) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: ERROR_USER_NOT_FOUND,
                });
            }

            return filterUserForClient(user);
        }),

    getUserById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const user = await clerkClient.users.getUser(input.id);

            if (!user) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: ERROR_USER_NOT_FOUND,
                });
            }

            return filterUserForClient(user);
        }),

    deleteUser: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            const user = await clerkClient.users.deleteUser(input.id);

            if (!user) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: ERROR_USER_NOT_FOUND,
                });
            }
        }),
});
