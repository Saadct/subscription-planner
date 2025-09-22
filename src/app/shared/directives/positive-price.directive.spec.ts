import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PositivePriceDirective } from './positive-price.directive';

@Component({
    template: `<input type="number" [formControl]="control" appPositivePrice />`,
    standalone: true,
    imports: [ReactiveFormsModule, PositivePriceDirective]
})
class TestComponent {
    control = new FormControl(0);
}

describe('PositivePriceDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let input: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent] // ← standalone component importé ici
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        input = fixture.nativeElement.querySelector('input');
    });

    it('should set negative input to 0', () => {
        input.value = '-50';
        input.dispatchEvent(new Event('input'));
        expect(component.control.value).toBe(0);
        expect(input.value).toBe('0');
    });

    it('should keep positive input unchanged', () => {
        input.value = '123.45';
        input.dispatchEvent(new Event('input'));
        expect(component.control.value).toBe(123.45);
        expect(input.value).toBe('123.45');
    });

    it('should set non-numeric input to 0', () => {
        input.value = 'abc';
        input.dispatchEvent(new Event('input'));
        expect(component.control.value).toBe(0);
        expect(input.value).toBe('0');
    });
});
