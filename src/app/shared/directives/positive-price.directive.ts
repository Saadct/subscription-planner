import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appPositivePrice]'
})
export class PositivePriceDirective {
    constructor(private ngControl: NgControl) { }

    @HostListener('input', ['$event'])
    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = parseFloat(input.value);

        if (isNaN(value) || value < 0) {
            value = 0;
            input.value = value.toString();
            if (this.ngControl.control) {
                this.ngControl.control.setValue(value);
            }
        }
    }
}
