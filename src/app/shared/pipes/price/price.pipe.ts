// price.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'priceEuro',
    standalone: true
})
export class PriceEuroPipe implements PipeTransform {
    transform(value: number | null | undefined): string {
        if (value == null || isNaN(value)) return ''; // <- gestion null/undefined/NaN
        return value.toFixed(2) + ' €';
    }
}
