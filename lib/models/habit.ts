interface Habits {
    createdAt: string;
    id: string;
    title: string;
    trackers: {
        month: number;
        year: number;
        goal: number;
        achieved: number;
    }[];
    updatedAt: string;
    userId: string;
}

export default Habits;