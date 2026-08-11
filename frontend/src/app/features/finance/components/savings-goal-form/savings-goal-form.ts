import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
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
export class SavingsGoalForm implements OnChanges {
    @Input()
    goal: SavingsGoal | null = null;

    @Output()
    goalSaved =
        new EventEmitter<SavingsGoal>();

    @Output()
    goalArchived =
        new EventEmitter<number>();

    @Output()
    cancelRequested =
        new EventEmitter<void>();

    name = '';
    targetAmount: number | null = null;
    currentAmount: number | null = 0;
    targetDate = '';

    isSaving = false;
    isArchiving = false;
    showArchiveConfirmation = false;
    errorMessage = '';

    constructor(
        private savingsGoalService: SavingsGoalService
    ) {
    }

    get isEditing(): boolean {
        return this.goal !== null;
    }

    ngOnChanges(
        changes: SimpleChanges
    ): void {
        if (changes['goal']) {
            this.populateForm();
        }
    }

    onSubmit(): void {
        const trimmedName =
            this.name.trim();

        const targetAmount =
            this.targetAmount;

        this.errorMessage = '';

        if (
            trimmedName === '' ||
            targetAmount === null ||
            targetAmount <= 0
        ) {
            this.errorMessage =
                'Please enter a name and a target amount greater than £0.';

            return;
        }

        if (this.goal !== null) {
            if (
                targetAmount <
                    this.goal.currentAmount
            ) {
                this.errorMessage =
                    'The target cannot be less than the amount already saved.';

                return;
            }

            this.updateGoal(
                this.goal,
                trimmedName,
                targetAmount
            );

            return;
        }

        const currentAmount =
            this.currentAmount ?? 0;

        if (
            currentAmount < 0 ||
            currentAmount > targetAmount
        ) {
            this.errorMessage =
                'The current amount must be between £0 and the target amount.';

            return;
        }

        this.createGoal(
            trimmedName,
            targetAmount,
            currentAmount
        );
    }

    requestArchive(): void {
        this.errorMessage = '';
        this.showArchiveConfirmation = true;
    }

    cancelArchive(): void {
        this.showArchiveConfirmation = false;
    }

    archiveGoal(): void {
        if (this.goal === null) {
            return;
        }

        this.errorMessage = '';
        this.isArchiving = true;

        const goalId = this.goal.id;

        this.savingsGoalService
            .archiveSavingsGoal(goalId)
            .subscribe({
                next: () => {
                    this.isArchiving = false;
                    this.goalArchived.emit(goalId);
                },
                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        'The savings goal could not be archived.';

                    this.isArchiving = false;
                }
            });
    }

    cancel(): void {
        if (
            this.isSaving ||
            this.isArchiving
        ) {
            return;
        }

        this.cancelRequested.emit();
    }

    private createGoal(
        name: string,
        targetAmount: number,
        currentAmount: number
    ): void {
        this.isSaving = true;

        this.savingsGoalService
            .createSavingsGoal({
                name: name,
                targetAmount: targetAmount,
                currentAmount: currentAmount,
                targetDate:
                    this.targetDate === ''
                        ? null
                        : this.targetDate
            })
            .subscribe({
                next: (createdGoal) => {
                    this.isSaving = false;
                    this.goalSaved.emit(
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

    private updateGoal(
        goal: SavingsGoal,
        name: string,
        targetAmount: number
    ): void {
        this.isSaving = true;

        this.savingsGoalService
            .updateSavingsGoal(
                goal.id,
                {
                    name: name,
                    targetAmount:
                        targetAmount,
                    targetDate:
                        this.targetDate === ''
                            ? null
                            : this.targetDate
                }
            )
            .subscribe({
                next: (updatedGoal) => {
                    this.isSaving = false;
                    this.goalSaved.emit(
                        updatedGoal
                    );
                },
                error: (error) => {
                    console.error(error);

                    this.errorMessage =
                        'The savings goal could not be updated.';

                    this.isSaving = false;
                }
            });
    }

    private populateForm(): void {
        this.isSaving = false;
        this.isArchiving = false;
        this.showArchiveConfirmation = false;
        this.errorMessage = '';

        if (this.goal === null) {
            this.name = '';
            this.targetAmount = null;
            this.currentAmount = 0;
            this.targetDate = '';
            return;
        }

        this.name = this.goal.name;
        this.targetAmount =
            this.goal.targetAmount;
        this.currentAmount =
            this.goal.currentAmount;
        this.targetDate =
            this.goal.targetDate === null
                ? ''
                : this.goal.targetDate.substring(
                    0,
                    10
                );
    }
}