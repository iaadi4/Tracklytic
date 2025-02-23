"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface ExpenseCardProps {
    expense: {
        id: string;
        title: string;
        amount: number;
    };
    onUpdate: () => void;
}

export default function ExpenseCard({ expense, onUpdate }: ExpenseCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editAmount, setEditAmount] = useState(expense.amount);

    const handleUpdate = async () => {
        try {
            await axios.post("/api/expense", {
                action: "update",
                expenseId: expense.id,
                title: expense.title,
                amount: editAmount
            });
            toast.success("Expense updated successfully");
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update expense");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete("/api/expense", {
                data: { expenseId: expense.id }
            });
            toast.success("Expense deleted successfully");
            onUpdate();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete expense");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">{expense.title}</h3>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(!isEditing)}
                        className="h-8 w-8 p-0"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        className="h-8 w-8 p-0"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(Number(e.target.value))}
                            className="w-32"
                        />
                        <Button
                            onClick={handleUpdate}
                            size="icon"
                            className="h-8 w-8 p-0"
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsEditing(false);
                                setEditAmount(expense.amount);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <p className="text-2xl font-bold">₹{expense.amount.toLocaleString('en-IN')}</p>
                )}
            </CardContent>
        </Card>
    );
}