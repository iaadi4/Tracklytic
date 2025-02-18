import prisma from "@/lib/prisma";
import statusCode from "@/lib/statusCode";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || !session.user) {
        return new Response(JSON.stringify({
            status: statusCode.UNAUTHORIZED_ACCESS,
            data: {},
            message: "Unauthorized access",
            error: {}
        }));
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true
            }
        });
        if (!user) {
            return new Response(JSON.stringify({
                status: statusCode.NOT_FOUND,
                data: {},
                message: "User not found",
                error: {}
            }));
        }
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            data: user,
            message: "User settings fetched successfully",
            error: {}
        }));
    } catch (error) {
        console.error("Error fetching user settings:", error);
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to fetch user settings",
            error: {
                details: error instanceof Error ? error.message : "Unknown error occurred"
            }
        }));
    }
}