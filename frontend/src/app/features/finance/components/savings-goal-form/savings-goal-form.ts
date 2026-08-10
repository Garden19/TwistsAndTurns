import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type SavingsGoal } from '../../models/savings-goal';
import { SavingsGoalService } from '../../services/savings-goal.service';

@Component({
    selector: 'app-savings-goal-form',
    imports: [
        FormsModule
    ],
    templateUrl: './savings-goal-form.html',
    styleUrl: './savings-goal-form.css'
})
export class SavingsGoalForm {
    @Output()
    goalCreated =
        new EventEmitter<SavingsGoal>();

    name = '';
    targetAmount = 0;
    currentAmount = 0;
    targetDate = '';

    isSaving = false;
    errorMessage = '';

    constructor(
        private savingsGoalService: SavingsGoalService
    ) {
    }

    onSubmit(): void {
        const trimmedName =
            this.name.trim();

        if (
            trimmedName === '' ||
            this.targetAmount <= 0 ||
            this.currentAmount < 0 ||
            this.currentAmount >
                this.targetAmount
        ) {
            this.errorMessage =
                'Please check the goal details.';
            return;
        }

        this.isSaving = true;
        this.errorMessage = '';

        this.savingsGoalService
            .createSavingsGoal({
                name: trimmedName,
                targetAmount:
                    this.targetAmount,
                currentAmount:
                    this.currentAmount,
                targetDate:
                    this.targetDate === ''
                        ? null
                        : this.targetDate
            })
            .subscribe({
                next: (createdGoal) => {
                    this.resetForm();
                    this.isSaving = false;

                    this.goalCreated.emit(
                        createdGoal
                    );
                },
                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        'The savings goal could not be created.';

                    this.isSaving = false;
                }
            });
    }

    private resetForm(): void {
        this.name = '';
        this.targetAmount = 0;
        this.currentAmount = 0;
        this.targetDate = '';
        this.errorMessage = '';
    }
}