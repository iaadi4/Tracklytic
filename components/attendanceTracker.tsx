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
import { Plus, Minus, Trash2, Loader2, CheckCircle2, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Tracker from '@/lib/models/attendance';

interface UpdateClassParams {
    habitId: string;
    incrementClassAttended?: number;
    incrementTotalClass?: number;
}

interface CompleteParams {
    habitId: string;
    completed: boolean;
}

export default function TrackerComponent({ tracker }: { tracker: Tracker }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const handleUpdateClassAttended = useMutation({
        mutationFn: ({ habitId, incrementClassAttended }: UpdateClassParams) => {
            return axios.post('/api/attendance', {
                action: "updateClassAttended",
                habitId,
                incrementClassAttended
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        }
    });

    const handleUpdateTotalClass = useMutation({
        mutationFn: ({ habitId, incrementTotalClass }: UpdateClassParams) => {
            return axios.post('/api/attendance', {
                action: "updateTotalClass",
                habitId,
                incrementTotalClass
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        }
    });

    const handleDeleteTracker = useMutation({
        mutationFn: (habitId: string) => {
            return axios.delete('/api/attendance', {
                data: { habitId }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        }
    });

    const handleComplete = useMutation({
        mutationFn: ({ habitId, completed }: CompleteParams) => {
            return axios.post('/api/attendance', {
                action: "completed",
                habitId,
                completed
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
            setIsDialogOpen(false);
        }
    });

    const attendancePercentage = (tracker.classAttended / Number(tracker.totalClass)) * 100;

    return (
        <Card
            key={tracker.id}
            className={`border transition-all duration-300 ${
                tracker.completed ? 'bg-zinc-50' : 'bg-white'
            } hover:shadow-lg hover:-translate-y-1`}
        >
            <CardHeader className="py-4">
                <CardTitle className="flex justify-between items-center text-base">
                    <div className="flex items-center gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-zinc-100"
                                    disabled={handleComplete.isPending}
                                >
                                    {handleComplete.isPending ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : tracker.completed ? (
                                        <CheckCircle2 className="h-5 w-5 text-zinc-900" />
                                    ) : (
                                        <CircleDashed className="h-5 w-5 text-zinc-400" />
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {tracker.completed ? 'Reopen Tracker' : 'Complete Tracker'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {tracker.completed 
                                            ? 'Are you sure you want to reopen this tracker?' 
                                            : 'Are you sure you want to mark this tracker as complete?'}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => handleComplete.mutate({
                                            habitId: tracker.id,
                                            completed: !tracker.completed
                                        })}
                                    >
                                        {tracker.completed ? 'Reopen' : 'Complete'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <span className="text-zinc-900 text-lg">{tracker.title}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTracker.mutate(tracker.id)}
                        disabled={handleDeleteTracker.isPending}
                        className="h-9 w-9 hover:bg-zinc-100"
                    >
                        {handleDeleteTracker.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Trash2 className="h-5 w-5 text-zinc-600 hover:text-zinc-900" />
                        )}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[0.7rem] text-zinc-600">Class Attended</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleUpdateClassAttended.mutate({
                                            habitId: tracker.id,
                                            incrementClassAttended: -1
                                        })}
                                        disabled={handleUpdateClassAttended.isPending || tracker.classAttended <= 0}
                                        className="h-7 w-7"
                                    >
                                        {handleUpdateClassAttended.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Minus className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <span className="text-sm font-medium w-7 text-center">{tracker.classAttended}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleUpdateClassAttended.mutate({
                                            habitId: tracker.id,
                                            incrementClassAttended: 1
                                        })}
                                        disabled={handleUpdateClassAttended.isPending || tracker.classAttended >= tracker.totalClass}
                                        className="h-7 w-7"
                                    >
                                        {handleUpdateClassAttended.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[0.7rem] text-zinc-600">Total Classes</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleUpdateTotalClass.mutate({
                                            habitId: tracker.id,
                                            incrementTotalClass: -1
                                        })}
                                        disabled={handleUpdateTotalClass.isPending || tracker.totalClass <= 1}
                                        className="h-7 w-7"
                                    >
                                        {handleUpdateTotalClass.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Minus className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <span className="text-sm font-medium w-7 text-center">{tracker.totalClass}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleUpdateTotalClass.mutate({
                                            habitId: tracker.id,
                                            incrementTotalClass: 1
                                        })}
                                        disabled={handleUpdateTotalClass.isPending}
                                        className="h-7 w-7"
                                    >
                                        {handleUpdateTotalClass.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Progress
                            value={attendancePercentage}
                            className="h-2"
                        />
                        <p className="text-xs text-zinc-500 text-right">
                            {attendancePercentage.toFixed(1)}% Complete
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}