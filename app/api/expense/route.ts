import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import statusCode from "@/lib/statusCode";

export async function POST(req: Request) {
    const { action, title, amount, expenseId } = await req.json();
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
    switch(action) {
        case "create":
            if (!title || !amount) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Title and amount are required to create an expense.",
                    error: {}
                }))
            }
            try {
                const month = new Date().getMonth();
                const year = new Date().getFullYear();
                const response = await prisma.expenses.create({
                    data: {
                        userId,
                        title,
                        amount,
                        month,
                        year
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.CREATE,
                    data: response,
                    message: "Expense created successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to create expense",
                    error: error
                }))
            }
        case "update":
            if (!title || !amount) {
                return new Response(JSON.stringify({
                    status: statusCode.BAD_REQUEST,
                    data: {},
                    message: "Title and amount are required to update an expense.",
                    error: {}
                }))
            }
            try {
                const response = await prisma.expenses.update({
                    where: {
                        userId,
                        id: expenseId
                    },
                    data: {
                        amount
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    data: response,
                    message: "Expense updated successfully",
                    error: {}
                }))
            } catch (error) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNAL_SERVER_ERROR,
                    data: {},
                    message: "Failed to update expense",
                    error: error
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
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        const response = await prisma.expenses.findMany({
            where: {
                userId,
                month,
                year
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            data: response,
            message: "Expenses fetched successfully",
            error: {}
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to fetch expenses",
            error: error
        }))
    }
}

export async function DELETE(req: Request) {
    const { expenseId } = await req.json();
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
        const response = await prisma.expenses.delete({
            where: {
                userId,
                id: expenseId
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            data: response,
            message: "Expense deleted successfully",
            error: {}
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNAL_SERVER_ERROR,
            data: {},
            message: "Failed to delete expense",
            error: error
        }))
    }
}