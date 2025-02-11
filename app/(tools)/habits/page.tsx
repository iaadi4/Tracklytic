"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import HabitCard from "@/components/habitComponent";
import { toast } from "sonner";
import Habits from "@/lib/models/habit";

export default function Habit() {
    const [habits, setHabits] = useState<Habits[]>([]);
    const [filteredHabits, setFilteredHabits] = useState<Habits[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [habitTitle, setHabitTitle] = useState("");
    const [habitGoals, setHabitGoals] = useState<number | "">("");

    const getHabits = async () => {
        const response = await axios.get("/api/habits", { withCredentials: true });
        setHabits(response.data?.data);
        setFilteredHabits(response.data?.data);
        return response.data?.data;
    };

    const { refetch, isLoading, isError } = useQuery({
        queryKey: ["habits"],
        queryFn: getHabits,
    });

    const handleCreateHabit = useMutation({
        mutationFn: ({ title, goal }: { title: string; goal: number }) => {
            return axios.post("/api/habits", { action: "create", title, goal });
        },
        onSuccess: () => {
            toast.success("Habit created successfully");
            setHabitTitle("");
            setHabitGoals("");
            refetch();
        },
    });

    const filterHabits = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        setSearchQuery(search);
        setFilteredHabits(habits.filter((habit) => habit.title.toLowerCase().includes(search)));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setHabitGoals(value === "" ? "" : Number(value));
        }
    };

    useEffect(() => {
        setFilteredHabits(habits);
    }, [habits]);

    return (
        <div className="min-h-screen overflow-y-auto flex w-full flex-col">
            <div className="flex w-full h-12 items-center mt-2">
                <p className="text-xl ml-8">Habits</p>
                <div className="mr-5 w-full ml-8">
                    <Input
                        placeholder="Search habits..."
                        type="text"
                        value={searchQuery}
                        onChange={filterHabits}
                        className="md:w-1/4 w-1/3 h-8 ml-auto focus:bg-black focus:text-white"
                    />
                </div>
                <Dialog>
                    <DialogTrigger>
                        <div className="p-2 mr-5 rounded-full hover:bg-gray-100 hover:scale-110 text-gray-600 transition-all hover:text-black">
                            <Pencil className="h-5 w-5" />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create a habit</DialogTitle>
                            <DialogDescription>
                                Motivation is what gets you started, habit is what keeps you going.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="name"
                                    onChange={(e) => setHabitTitle(e.target.value)}
                                    value={habitTitle}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="goal" className="text-right">
                                    Goal
                                </Label>
                                <Input
                                    id="goal"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onChange={handleChange}
                                    value={habitGoals.toString()}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={() => handleCreateHabit.mutate({ title: habitTitle, goal: Number(habitGoals) })}
                                disabled={!habitTitle || habitGoals === ""}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && <p className="text-center mt-32">Loading habits...</p>}
            {isError && <p className="text-center mt-32">Failed to load habits.</p>}


            {filteredHabits.length > 0 ? (
                filteredHabits.map((habit) => (
                    <div key={habit.id} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-8 mt-6 w-full">
                        <HabitCard habit={habit} />
                    </div>
                ))
            ) : (
                <div>
                    {!isLoading && <p className="text-center w-full mx-auto mt-32 col-span-full text-gray-500">No habits found.</p>}
                </div>
            )}
        </div>
    );
}