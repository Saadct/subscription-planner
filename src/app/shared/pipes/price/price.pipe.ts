import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'priceEuro',
    standalone: true
})
export class PriceEuroPipe implements PipeTransform {
    transform(value: number | null | undefined): string {
        if (value === null || value === undefined || isNaN(value)) return '';
        return value.toFixed(2) + ' €';
    }
}
