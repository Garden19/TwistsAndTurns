import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    name = '';
    targetAmount = 0;
    currentAmount = 0;
    targetDate = '';

    constructor(
        private savingsGoalService: SavingsGoalService
    ) {
    }

    onSubmit(): void {
        this.savingsGoalService
            .createSavingsGoal({
                name: this.name,
                targetAmount: this.targetAmount,
                currentAmount: this.currentAmount,
                targetDate:
                    this.targetDate === ''
                        ? null
                        : this.targetDate
            })
            .subscribe();
    }
}