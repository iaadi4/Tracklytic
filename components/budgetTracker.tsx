import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, PiggyBank, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Budgets from '@/lib/models/budget';


const BudgetTracker = ({ budget }: { budget: Budgets}) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSavingsDialogOpen, setIsSavingsDialogOpen] = useState(false);
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
    const [newSavingsValue, setNewSavingsValue] = useState("");
    const [newGoalValue, setNewGoalValue] = useState("");
    const queryClient = useQueryClient();
    
    const handleUpdateSavings = useMutation({
        mutationFn: ({ newValue }: { newValue: number }) => {
            return axios.post('/api/budget', {
                action: "updateSavings",
                budgetId: budget.id,
                updatedSavingsValue: newValue
            });
        },
        onSuccess: () => {
            setNewSavingsValue("")
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            setIsSavingsDialogOpen(false);
        }
    });

    const handleUpdateGoal = useMutation({
        mutationFn: ({ newValue }: { newValue: number }) => {
            return axios.post('/api/budget', {
                action: "updateGoal",
                budgetId: budget.id,
                updateGoalValue: newValue
            });
        },
        onSuccess: () => {
            setNewGoalValue('');
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            setIsGoalDialogOpen(false);
        }
    });

    const handleDeleteBudget = useMutation({
        mutationFn: (budgetId: string) => {
            return axios.delete('/api/budget', {
                data: { budgetId }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            setIsDeleteDialogOpen(false);
        }
    });

    const percentage = Math.min((budget.saving / budget.goal) * 100, 100);

    return (
        <>
            <Card className={`border transition-all duration-300 ${
                budget.completed ? 'bg-zinc-50' : 'bg-white'
            } hover:shadow-lg transform hover:-translate-y-1`}>
                <CardHeader className="py-4">
                    <CardTitle className="flex justify-between items-center text-base">
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-900 text-lg font-semibold">{budget.title}</span>
                        </div>
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Budget</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete &quot;{budget.title}&quot;? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDeleteDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteBudget.mutate(budget.id)}
                                        disabled={handleDeleteBudget.isPending}
                                    >
                                        {handleDeleteBudget.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : null}
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <Dialog open={isSavingsDialogOpen} onOpenChange={setIsSavingsDialogOpen}>
                                <DialogTrigger asChild>
                                    <div className="space-y-2 cursor-pointer p-3 rounded-lg hover:bg-zinc-50 transition-colors">
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <PiggyBank className="h-4 w-4" />
                                            <span className="text-sm">Current Savings</span>
                                        </div>
                                        <span className="text-xl font-semibold">₹{budget.saving.toLocaleString()}</span>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Update Savings</DialogTitle>
                                        <DialogDescription>
                                            Enter the new savings amount for &quot;{budget.title}&quot;
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Input
                                        type="number"
                                        value={newSavingsValue}
                                        onChange={(e) => setNewSavingsValue(e.target.value)}
                                        placeholder="Enter new savings amount"
                                    />
                                    <DialogFooter>
                                        <Button
                                            onClick={() => handleUpdateSavings.mutate({
                                                newValue: parseInt(newSavingsValue)
                                            })}
                                            disabled={handleUpdateSavings.isPending}
                                        >
                                            {handleUpdateSavings.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : null}
                                            Update Savings
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                                <DialogTrigger asChild>
                                    <div className="space-y-2 cursor-pointer p-3 rounded-lg hover:bg-zinc-50 transition-colors">
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <Target className="h-4 w-4" />
                                            <span className="text-sm">Goal Amount</span>
                                        </div>
                                        <span className="text-xl font-semibold">₹{budget.goal.toLocaleString()}</span>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Update Goal</DialogTitle>
                                        <DialogDescription>
                                            Enter the new goal amount for &quot;{budget.title}&quot;
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Input
                                        type="number"
                                        value={newGoalValue}
                                        onChange={(e) => setNewGoalValue(e.target.value)}
                                        placeholder="Enter new goal amount"
                                    />
                                    <DialogFooter>
                                        <Button
                                            onClick={() => handleUpdateGoal.mutate({
                                                newValue: parseInt(newGoalValue)
                                            })}
                                            disabled={handleUpdateGoal.isPending}
                                        >
                                            {handleUpdateGoal.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : null}
                                            Update Goal
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="space-y-2">
                            <Progress
                                value={percentage}
                                className="h-3 rounded-lg"
                            />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Progress</span>
                                <span className="font-medium">
                                    {percentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default BudgetTracker;