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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuery, useMutation } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import ExpenseCard from "@/components/expenseCard";
import axios from "axios";

interface Expense {
    id: string;
    title: string;
    amount: number;
    month: number;
    year: number;
    userId: string;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear];

export default function Expense() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState<number>(0);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const filterExpenses = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setFilteredExpenses(
            expenses.filter((expense) =>
                expense.title.toLowerCase().includes(e.target.value.toLowerCase()) &&
                expense.month === selectedMonth &&
                expense.year === selectedYear
            )
        );
    }

    const handleMonthChange = (value: string) => {
        const monthIndex = months.indexOf(value);
        setSelectedMonth(monthIndex);
        setFilteredExpenses(
            expenses.filter((expense) =>
                expense.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                expense.month === monthIndex &&
                expense.year === selectedYear
            )
        );
    };

    const handleYearChange = (value: string) => {
        const year = parseInt(value);
        setSelectedYear(year);
        setFilteredExpenses(
            expenses.filter((expense) =>
                expense.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                expense.month === selectedMonth &&
                expense.year === year
            )
        );
    };

    const getExpenses = async () => {
        const response = await axios.get("/api/expense", { withCredentials: true });
        setExpenses(response.data?.data);
        setFilteredExpenses(response.data?.data.filter((expense: Expense) => 
            expense.month === selectedMonth && 
            expense.year === selectedYear
        ));
        return response.data?.data;
    };

    const { refetch, isLoading, isError } = useQuery({
        queryKey: ["expenses"],
        queryFn: getExpenses,
    });

    const handleExpenseCreate = useMutation({
        mutationFn: ({ title, amount }: { title: string; amount: number }) => {
            const response = axios.post("/api/expense", { 
                action: "create", 
                title, 
                amount 
            });
            return response;
        },
        onSuccess: () => {
            toast.success("Expense created successfully");
            setExpenseTitle("");
            setExpenseAmount(0);
            refetch();
        },
    });

    return (
        <div className="min-h-screen overflow-y-auto flex w-full flex-col">
            <div className="flex w-full h-12 items-center mt-2">
                <p className="text-xl ml-8">Expenses</p>
                <div className="flex-1 flex justify-end items-center">
                    <div className="flex items-center gap-4">
                        <Input
                            placeholder="Search..."
                            type="text"
                            value={searchQuery}
                            onChange={filterExpenses}
                            className="md:w-1/4 w-1/3 h-8 focus:bg-black focus:text-white"
                        />
                        <Select
                            value={selectedYear.toString()}
                            onValueChange={handleYearChange}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={months[selectedMonth]}
                            onValueChange={handleMonthChange}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger>
                        <div className="p-2 mr-5 rounded-full hover:bg-gray-100 hover:scale-110 text-gray-600 transition-all hover:text-black">
                            <Pencil className="h-5 w-5" />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create new expense</DialogTitle>
                            <DialogDescription>
                                Add your expense details here.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="name"
                                    onChange={(e) => setExpenseTitle(e.target.value)}
                                    value={expenseTitle}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Amount
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                                    value={expenseAmount}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={() => handleExpenseCreate.mutate({ 
                                    title: expenseTitle, 
                                    amount: expenseAmount 
                                })}
                                disabled={!expenseTitle || !expenseAmount}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && <p className="text-center mt-32">Loading expenses...</p>}
            {isError && <p className="text-center mt-32">Failed to load expenses.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-8 mt-6 w-full">
                {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                        <div key={expense.id}>
                            <ExpenseCard 
                                expense={expense}
                                onUpdate={refetch}
                            />
                        </div>
                    ))
                ) : (
                    <div>
                        {!isLoading && (
                            <p className="text-center w-full mx-auto mt-32 col-span-full text-gray-500">
                                No expenses found for {months[selectedMonth]} {selectedYear}.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}