"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Tracker from '@/lib/models/attendance';
import TrackerComponent from "@/components/attendanceTracker";

interface CreateTrackerParams {
    title: string;
    totalClass: number;
}

const AttendanceTracker = () => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [filteredTrackers, setFilteredTrackers] = useState<Tracker[]>([]);
    const [trackerTitle, setTrackerTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [totalClass, setTotalClass] = useState(0);

    const getTrackers = async (): Promise<Tracker[]> => {
        const response = await axios.get('/api/attendance', {
            withCredentials: true
        });
        setTrackers(response.data?.data);
        setFilteredTrackers(response.data?.data);
        return response.data?.data;
    };

    const { refetch, isLoading, isError } = useQuery({
        queryKey: ['attendance'],
        queryFn: getTrackers
    });

    const filterTrackers = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        setSearchQuery(search);
        if (search === "") {
            setFilteredTrackers(trackers);
        } else {
            setFilteredTrackers(trackers.filter(tracker => 
                tracker.title.toLowerCase().includes(search.toLowerCase())
            ));
        }
    };

    const handleCreateTracker = useMutation({
        mutationFn: ({ title, totalClass }: CreateTrackerParams) => {
            return axios.post('/api/attendance', {
                action: "create",
                title,
                totalClass
            });
        },
        onSuccess: () => {
            setTrackerTitle("");
            setTotalClass(0);
            refetch();
        }
    });

    console.log(filteredTrackers);

    return (
        <div className="min-h-screen overflow-y-auto flex w-full flex-col">
            <div className="flex w-full h-12 items-center mt-2">
                <p className="text-xl ml-8">Attendance</p>
                <div className="mr-5 w-full ml-8">
                    <Input
                        placeholder="Search..."
                        type="text"
                        value={searchQuery}
                        onChange={filterTrackers}
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
                            <DialogTitle>Track your attendance</DialogTitle>
                            <DialogDescription>
                                Create a new attendance tracker
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="name"
                                    onChange={(e) => setTrackerTitle(e.target.value)}
                                    value={trackerTitle}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="goal" className="text-right">
                                    Total Classes
                                </Label>
                                <Input
                                    type="number"
                                    onChange={(e) => setTotalClass(Number(e.target.value))}
                                    value={totalClass}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={() => handleCreateTracker.mutate({ title: trackerTitle, totalClass })}
                                disabled={!trackerTitle}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading && <p className="text-center mt-32">Loading Trackers...</p>}
            {isError && <p className="text-center mt-32">Failed to load Attendance trackers.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-8 mt-6">
                {filteredTrackers.length > 0 ? (
                    filteredTrackers.map((tracker) => (
                        <div key={tracker.id}>
                            <TrackerComponent tracker={tracker} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        {!isLoading && (
                            <p className="text-center w-full mx-auto mt-32 text-gray-500">
                                No Tracker found.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceTracker;