export interface SavingsGoal {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string | null;
    isActive: boolean;
    createdAt: string;
}