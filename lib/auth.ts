import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import sendEmail from "./mailSender";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            const resetUrl = `${new URL(url).origin}/reset-password?token=${token}`
            await sendEmail(
                "aditya.2023ug2061@iiitranchi.ac.in",
                user.email,
                "Tracklytic: Reset your password",
                `Click on this link to reset password, ${resetUrl}`
            )
        }
    }
})