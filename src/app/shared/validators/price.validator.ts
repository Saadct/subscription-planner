import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positivePriceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value === null || value <= 0) {
            return { positivePrice: 'Le prix doit être supérieur à 0' };
        }
        return null;
    };
}
