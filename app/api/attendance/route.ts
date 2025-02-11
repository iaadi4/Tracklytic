import prisma from "@/lib/prisma";
import statusCode from "@/lib/statusCode";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || !session.user) {
        return new Response(JSON.stringify({
            status: statusCode.UNAUTHORIZED_ACCESS,
            data: {},
            message: "Unauthorized access",
            error: {}
        }))
    }
    const userId = session.user.id;
    const {
        action,
        title,
        habitId,
        completed,
        totalClass,
        classAttended,
        incrementTotalClass,
        incrementClassAttended
    } = await req.json();
    switch (action) {
        case "create":
            if (!title) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Title is required to create attendance tracker",
                    error: {}
                }))
            }
            try {
                const response = await prisma.attendance.create({
                    data: {
                        userId,
                        title,
                        totalClass,
                        classAttended
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    data: response,
                    message: "Attendance tracker created successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to create attendance tracker",
                    error
                }))
            }
        case "updateTotalClass":
            if(!incrementTotalClass) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Increment value is required",
                    error: {}
                }))
            }
            try {
                await prisma.attendance.updateMany({
                    where: {
                        userId,
                        id: habitId
                    },
                    data: {
                        totalClass: {
                            increment: incrementTotalClass
                        }
                    }
                })
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to update total class value",
                    error
                }))
            }
        case "updateClassAttended":
            if(!incrementClassAttended) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Increment value is required to update class attended",
                    error: {}
                }))
            }
            try {
                await prisma.attendance.updateMany({
                    where: {
                        userId,
                        id: habitId
                    },
                    data: {
                        classAttended: {
                            increment: incrementClassAttended
                        }
                    }
                })
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to update total class value",
                    error
                }))
            }
        case "completed":
            try {
                await prisma.attendance.updateMany({
                    where: {
                        userId,
                        id: habitId
                    },
                    data: {
                        completed: !completed
                    }
                })
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to update completed",
                    error
                }))
            }
        default: 
            return new Response(JSON.stringify({
                status: statusCode.BAD_REQUEST,
                data: {},
                message: "Invalid action type",
                error: {}
            }))
    }
}

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
        }))
    }
    const userId = session.user.id;
    try {
        const response = await prisma.attendance.findMany({
            where: {
                userId
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            data: response,
            message: "All attendance tracker fetched",
            error: {}
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to fetch attendance trackers, please refresh",
            error
        }))
    }
}

export async function DELETE(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || !session.user) {
        return new Response(JSON.stringify({
            status: statusCode.UNAUTHORIZED_ACCESS,
            data: {},
            message: "Unauthorized access",
            error: {}
        }))
    }
    const userId = session.user.id;
    try {
        const { habitId } = await req.json();
        await prisma.attendance.delete({
            where: {
                userId,
                id: habitId
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.NO_CONTENT,
            data: {},
            message: "Attendance tracker deleted successfully"
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to delete attendance tracker",
            error
        }))
    }
}