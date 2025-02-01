import { PrismaClient } from '@prisma/client';
import statusCode from '../../utils/statusCodes';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { action, habitId, title, goal, achieved, incrementValue, newGoal } = await req.json();
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    switch (action) {
        case "create":
            if (!title || !goal || !achieved) {
                return new Response(JSON.stringify({
                    status: statusCode.BADREQUEST,
                    response: {},
                    message: "Missing required parameter",
                    error: {}
                }))
            }
            try {
                const newHabit = await prisma.habit.create({
                    data: {
                        title,
                        tracking: {
                            create: [
                                {
                                    month,
                                    year,
                                    goal,
                                    achieved
                                }
                            ]
                        }
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.CREATE,
                    response: newHabit,
                    error: {}
                }))
            } catch (error: any) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNALSERVERERROR,
                    response: {},
                    message: "Failed to create habit",
                    error
                }))
            }
        case "updateGoal":
            if (!habitId || !year || !month || !newGoal) {
                return new Response(JSON.stringify({
                    status: statusCode.BADREQUEST,
                    response: {},
                    message: "Missing required parameters",
                    error: {}
                }))
            }
            try {
                const updateGoal = await prisma.habitTracking.updateMany({
                    where: {
                        habitId,
                        year,
                        month
                    },
                    data: {
                        goal: newGoal
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    response: updateGoal,
                    message: "Goal updated successfully",
                    error: {}
                }))
            } catch (error: any) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNALSERVERERROR,
                    response: {},
                    message: "Failed to update goal",
                    error
                }))
            }
        case "updateAchieved":
            if (!habitId || !year || !month || !incrementValue) {
                return new Response(JSON.stringify({
                    status: statusCode.BADREQUEST,
                    response: {},
                    message: "Missing required parameters",
                    error: {}
                }))
            }
            try {
                const updateAchieved = await prisma.habitTracking.updateMany({
                    where: {
                        habitId,
                        month,
                        year
                    }, 
                    data: {
                        achieved: {
                            increment: incrementValue
                        }
                    }
                })
                return new Response(JSON.stringify({
                    status: statusCode.SUCCESS,
                    response: updateAchieved,
                    message: "Achieved updated successfully"
                }))
            } catch(error: any) {
                return new Response(JSON.stringify({
                    status: statusCode.INTERNALSERVERERROR,
                    response: {},
                    message: "Failed to update achieved",
                    error
                }))
            }
        default:
            return new Response(JSON.stringify({
                status: statusCode.BADREQUEST,
                response: {},
                message: "Invalid action type",
                error: {}
            }))
    }
}

export async function GET() {
    try {
        const habits = await prisma.habit.findMany({
            where: {
                tracking: {
                    some: {
                        month: new Date().getMonth(),
                        year: new Date().getFullYear()
                    }
                }
            },
            include: {
                tracking: {
                    select: {
                        month: true,
                        year: true,
                        goal: true,
                        achieved: true
                    }
                }
            }
        });
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            resposne: habits,
            message: "Habits fetched successfully",
            error: {}
        }))
    } catch (error: any) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNALSERVERERROR,
            response: {},
            message: "Failed to fetch habits",
            error
        }))
    }
}

export async function DELETE(req: Request) {
    const { habitId } = await req.json();
    if(!habitId) {
        return new Response(JSON.stringify({
            status: statusCode.BADREQUEST,
            response: {},
            message: "Invalid habit id",
            error: {}
        }))
    }
    try {
        const response = await prisma.habit.delete({
            where: {
                id: habitId
            }
        })
        return new Response(JSON.stringify({
            status: statusCode.SUCCESS,
            response,
            message: "Habit deleted successfully",
            error: {}
        }))
    } catch(error: any) {
        return new Response(JSON.stringify({
            status: statusCode.INTERNALSERVERERROR,
            response: {},
            message: "Failed to delete habit",
            error
        }))
    }
}