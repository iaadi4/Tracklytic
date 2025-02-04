import prisma from "@/lib/prisma";
import statusCode from "@/lib/statusCode";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    const { action, title, goal, achieved, updateGoalValue, achievedIncrementValue, habitId } = await req.json();
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
    switch (action) {
        case "create":
            if (!title) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Title is required to create a habit.",
                    error: {}
                }))
            }
            try {
                const month = new Date().getMonth();
                const year = new Date().getFullYear();
                const response = await prisma.habit.create({
                    data: {
                        userId,
                        title,
                        trackers: {
                            create: {
                                goal,
                                achieved,
                                month,
                                year
                            }
                        }
                    },
                    include: {
                        trackers: {
                            select: {
                                goal: true,
                                achieved: true,
                                month: true,
                                year: true
                            }
                        }
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.CREATE,
                    data: response,
                    message: "Habit created successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to create habit, please try again",
                    error
                }))
            }
        case "updateGoal":
            if (!updateGoalValue || !habitId) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Missing required fields",
                    error: {}
                }))
            }
            try {
                const response = await prisma.habitTracker.updateMany({
                    where: {
                        habitId,
                    },
                    data: {
                        goal: updateGoalValue
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    data: response,
                    message: "Goal updated successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to update goal, please try again",
                    error
                }))
            }
        case "updateAchieved":
            if (!achievedIncrementValue) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Missing required fields",
                    error: {}
                }))
            }
            try {
                const response = await prisma.habitTracker.updateMany({
                    where: {
                        habitId
                    },
                    data: {
                        achieved: {
                            increment: achievedIncrementValue
                        }
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    data: response,
                    message: "Updated achieved successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to update achieved, please try again",
                    error
                }))
            }
        default:
            return new Response(JSON.stringify({
                status: statusCode.BAD_REQUEST,
                data: {},
                message: "Invalid request",
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
        const response = await prisma.habit.findMany({
            where: {
                userId,
            },
            include: {
                trackers: {
                    select: {
                        month: true,
                        year: true,
                        goal: true,
                        achieved: true
                    }
                }
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            data: response,
            message: "Habits fetched successfully",
            error: {}
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to fetch habits, please refresh",
            error
        }))
    }
}

export async function DELETE(req: Request) {
    const { habitId } = await req.json();
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
    try {
        await prisma.habit.delete({
            where: {
                id: habitId
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.NO_CONTENT,
            data: {},
            message: "Habit deleted successfully",
            error: {}
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to delete the habit, please try again",
            error
        }))
    }
}