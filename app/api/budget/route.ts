import prisma from "@/lib/prisma";
import statusCode from "@/lib/statusCode";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    const { action, title, goal, updateGoalValue, updatedSavingsValue, budgetId } = await req.json();
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
                const response = await prisma.budget.create({
                    data: {
                        userId,
                        title,
                        goal
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    data: response,
                    message: "Budget tracker created successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to create budget tracker",
                    error
                }))
            }
        case "updateGoal":
            if (!updateGoalValue) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Update goal value is required to update the goal.",
                    error: {}
                }))
            }
            try {
                const response = await prisma.budget.update({
                    where: {
                        userId,
                        id: budgetId
                    },
                    data: {
                        goal: updateGoalValue
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    data: response,
                    message: "Budget tracker goal updated successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to update budget tracker goal",
                    error
                }))
            }
        case "updateSavings":
            if (!updatedSavingsValue) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Increment savings value is required",
                    error: {}
                }))
            }
            try {
                const response = await prisma.budget.update({
                    where: {
                        userId,
                        id: budgetId
                    },
                    data: {
                        saving: updatedSavingsValue
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    data: response,
                    message: "Budget tracker savings incremented successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to increment budget tracker savings",
                    error
                }))
            }
        default:
            return new Response(JSON.stringify({
                status: statusCode.BAD_REQUEST,
                data: {},
                message: "Invalid action",
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
        const budgets = await prisma.budget.findMany({
            where: {
                userId
            },
            orderBy: {
                title: "asc"
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            data: budgets,
            message: "Budget trackers fetched successfully",
            error: {}
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to fetch budget trackers",
            error
        }))
    }
}

export async function DELETE(req: Request) {
    const { budgetId } = await req.json();
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
        const response = await prisma.budget.delete({
            where: {
                userId,
                id: budgetId
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            data: response,
            message: "Budget tracker deleted successfully",
            error: {}
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to delete budget tracker",
            error
        }))
    }
}