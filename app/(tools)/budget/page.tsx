"use client"

import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import BudgetTracker from "@/components/budgetTracker";
import Budgets from "@/lib/models/budget";
import axios from "axios";

export default function Budget() {
    const [budgets, setBudgets] = useState<Budgets[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [budgetTitle, setBudgetTitle] = useState("");
    const [budgetAmount, setBudgetAmount] = useState<number>(0);
    const [filteredBudgets, setFilteredBudgets] = useState<Budgets[]>([]);

    const filterBudgets = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setFilteredBudgets(
            budgets.filter((budget) =>
                budget.title.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    }

    const getBudgets = async () => {
        const response = await axios.get("/api/budget", { withCredentials: true });
        setBudgets(response.data?.data);
        setFilteredBudgets(response.data?.data);
        return response.data?.data;
    };

    const { refetch, isLoading, isError } = useQuery({
        queryKey: ["budgets"],
        queryFn: getBudgets,
    });

    const handleBudgetCreate = useMutation({
        mutationFn: ({ title, goal }: { title: string; goal: number }) => {
            const response = axios.post("/api/budget", { action: "create", title, goal });
            return response;
        },
        onSuccess: () => {
            toast.success("Budget created successfully");
            setBudgetTitle("");
            setBudgetAmount(0);
            refetch();
        },
    })

    return (
        <div className="min-h-screen overflow-y-auto flex w-full flex-col">
            <div className="flex w-full h-12 items-center mt-2">
                <p className="text-xl ml-8">Budget</p>
                <div className="mr-5 w-full ml-8">
                    <Input
                        placeholder="Search..."
                        type="text"
                        value={searchQuery}
                        onChange={filterBudgets}
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
                            <DialogTitle>Create your budget</DialogTitle>
                            <DialogDescription>
                                The greatest wealth is to live content with little.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="name"
                                    onChange={(e) => setBudgetTitle(e.target.value)}
                                    value={budgetTitle}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="goal" className="text-right">
                                    Goal
                                </Label>
                                <Input
                                    id="goal"
                                    type="number"
                                    onChange={(e) => setBudgetAmount(Number(e.target.value))}
                                    value={budgetAmount.toString()}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={() => handleBudgetCreate.mutate({ title: budgetTitle, goal: Number(budgetAmount) })}
                                disabled={!budgetTitle}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && <p className="text-center mt-32">Loading budgets...</p>}
            {isError && <p className="text-center mt-32">Failed to load budgets.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-8 mt-6 w-full">
                {filteredBudgets.length > 0 ? (
                    filteredBudgets.map((budget) => (
                        <div key={budget.id}>
                            <BudgetTracker budget={budget} />
                        </div>
                    ))
                ) : (
                    <div>
                        {!isLoading && <p className="text-center w-full mx-auto mt-32 col-span-full text-gray-500">No budgets found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}