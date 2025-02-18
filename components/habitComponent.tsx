import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, Edit } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogDescription,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Habits from '@/lib/models/habit';

const HabitCard = ({ habit }: { habit: Habits }) => {
    const queryClient = useQueryClient();
    const currentDate = new Date();
    const currentTracker = habit.trackers.find(
        tracker => tracker.month === currentDate.getMonth() && tracker.year === currentDate.getFullYear()
    );

    const progress = currentTracker ? Math.min((currentTracker.achieved / currentTracker.goal) * 100, 100) : 0;
    const [newGoal, setNewGoal] = useState(currentTracker?.goal || 0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    console.log(newGoal);

    const deleteHabit = useMutation({
        mutationFn: () => axios.delete('/api/habits', { data: { habitId: habit.id } }),
        onSuccess: () => {
            toast.success('Habit deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
        onError: () => {
            toast.error('Failed to delete habit');
        },
    });

    const updateAchieved = useMutation({
        mutationFn: (increment: number) =>
            axios.post('/api/habits', {
                action: 'updateAchieved',
                habitId: habit.id,
                achievedIncrementValue: increment,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
        onError: () => {
            toast.error('Failed to update progress');
        },
    });

    const updateGoal = useMutation({
        mutationFn: () =>
            axios.post('/api/habits', {
                action: 'updateGoal',
                habitId: habit.id,
                updateGoalValue: newGoal,
            }),
        onSuccess: () => {
            toast.success('Goal updated successfully');
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
        onError: () => {
            toast.error('Failed to update goal');
        },
    });

    return (
        <Card className="w-full translate-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="font-semibold text-lg">{habit.title}</div>
                    <div className="text-sm text-gray-400">
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="text-lg font-semibold">
                                <DialogTitle>Delete Habit</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this habit? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        deleteHabit.mutate();
                                        setIsDialogOpen(false);
                                    }}
                                    disabled={deleteHabit.isPending}
                                >
                                    {deleteHabit.isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Progress</span>
                        <span>
                            {currentTracker?.achieved || 0} / {currentTracker?.goal || 0}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateAchieved.mutate(-1)}
                    disabled={!currentTracker?.achieved || updateAchieved.isPending}
                    className="disabled:opacity-50"
                >
                    {updateAchieved.isPending ? '...' : <Minus className="h-4 w-4" />}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateAchieved.mutate(1)}
                    disabled={currentTracker?.achieved === currentTracker?.goal || updateAchieved.isPending}
                    className="disabled:opacity-50"
                >
                    {updateAchieved.isPending ? '...' : <Plus className="h-4 w-4" />}
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="text-lg font-semibold">
                            <DialogTitle>Update Goal</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Input
                                type="number"
                                min="1"
                                value={newGoal}
                                onChange={e => setNewGoal(Number(e.target.value))}
                            />
                        </div>
                        <DialogFooter className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button
                                onClick={() => updateGoal.mutate()}
                                disabled={updateGoal.isPending}
                            >
                                {updateGoal.isPending ? 'Updating...' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
};

export default HabitCard;
