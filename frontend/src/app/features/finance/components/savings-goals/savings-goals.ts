import {
    CurrencyPipe,
    DatePipe
} from '@angular/common';
import {
    Component,
    OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type SavingsGoal } from '../../models/savings-goal';
import { SavingsGoalService } from '../../services/savings-goal.service';

@Component({
    selector: 'app-savings-goals',
    imports: [
        FormsModule,
        CurrencyPipe,
        DatePipe
    ],
    templateUrl: './savings-goals.html',
    styleUrl: './savings-goals.css'
})
export class SavingsGoals implements OnInit {
    savingsGoals: SavingsGoal[] = [];

    activeAddGoalId: number | null = null;
    savingGoalId: number | null = null;

    goalAmounts: Record<
        number,
        number | null
    > = {};

    contributionErrors: Record<
        number,
        string
    > = {};

    isLoading = true;
    loadErrorMessage = '';

    constructor(
        private savingsGoalService: SavingsGoalService
    ) {
    }

    ngOnInit(): void {
        this.loadSavingsGoals();
    }

    loadSavingsGoals(): void {
        this.isLoading = true;
        this.loadErrorMessage = '';

        this.savingsGoalService
            .getSavingsGoals()
            .subscribe({
                next: (goals) => {
                    this.savingsGoals = goals;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error(error);

                    this.loadErrorMessage =
                        'Your savings goals could not be loaded.';

                    this.isLoading = false;
                }
            });
    }

    toggleAddAmount(
        goalId: number
    ): void {
        delete this.contributionErrors[
            goalId
        ];

        if (
            this.activeAddGoalId === goalId
        ) {
            this.activeAddGoalId = null;
            this.goalAmounts[goalId] = null;
            return;
        }

        this.activeAddGoalId = goalId;

        if (
            this.goalAmounts[goalId] === undefined
        ) {
            this.goalAmounts[goalId] = null;
        }
    }

    confirmAddAmount(
        goal: SavingsGoal
    ): void {
        const amount =
            this.goalAmounts[goal.id];

        delete this.contributionErrors[
            goal.id
        ];

        if (
            amount === null ||
            amount === undefined ||
            amount <= 0
        ) {
            this.contributionErrors[goal.id] =
                'Please enter an amount greater than £0.';

            return;
        }

        this.savingGoalId = goal.id;

        this.savingsGoalService
            .addContribution(
                goal.id,
                amount
            )
            .subscribe({
                next: (updatedGoal) => {
                    this.savingsGoals =
                        this.savingsGoals.map(
                            (existingGoal) =>
                                existingGoal.id ===
                                updatedGoal.id
                                    ? updatedGoal
                                    : existingGoal
                        );

                    this.goalAmounts[goal.id] = null;
                    this.activeAddGoalId = null;
                    this.savingGoalId = null;
                },
                error: (error) => {
                    console.error(error);

                    this.contributionErrors[goal.id] =
                        'The contribution could not be added.';

                    this.savingGoalId = null;
                }
            });
    }

    getProgress(
        goal: SavingsGoal
    ): number {
        if (goal.targetAmount <= 0) {
            return 0;
        }

        const progress =
            (
                goal.currentAmount /
                goal.targetAmount
            ) * 100;

        return Math.min(
            Math.max(progress, 0),
            100
        );
    }

    getRemainingAmount(
        goal: SavingsGoal
    ): number {
        return Math.max(
            goal.targetAmount -
                goal.currentAmount,
            0
        );
    }

    getGoalChartBackground(
        goal: SavingsGoal
    ): string {
        const percentage =
            this.getProgress(goal);

        const degrees =
            (percentage / 100) * 360;

        return `conic-gradient(
            var(--colour-primary) 0deg ${degrees}deg,
            #e8e8e8 ${degrees}deg 360deg
        )`;
    }
}