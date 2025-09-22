import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddSubscription } from '../../models/subscription.model';
import { CategoryService } from '../../../admin/services/category.service';
import { Category } from '../../../admin/models/category.model';
import { positivePriceValidator } from '../../../../shared/validators/price.validator';
import { PositivePriceDirective } from '../../../../shared/directives/positive-price.directive';

@Component({
  selector: 'app-subscription-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PositivePriceDirective],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" *ngIf="open" (click)="onClose()"></div>
    <div class="fixed top-0 right-0 w-96 h-full bg-white shadow-xl transform transition-transform duration-300 z-50" [class.translate-x-full]="!open">
      <div class="p-6 flex flex-col h-full">
        <div class="flex justify-between items-center border-b pb-3">
          <h2 class="text-lg font-semibold">Nouvel abonnement</h2>
          <button (click)="onClose()" class="text-gray-500 hover:text-gray-800">✖</button>
        </div>

        <form [formGroup]="subscriptionForm" (ngSubmit)="onSave()" class="flex-1 flex flex-col gap-3 py-4">
          <input type="text" formControlName="name" placeholder="Nom de l'abonnement" class="border px-2 py-1 rounded" />
          <input type="number" formControlName="price" appPositivePrice placeholder="Prix (€)" class="border px-2 py-1 rounded" />
          <input type="date" formControlName="paymentDate" class="border px-2 py-1 rounded" />
          <select formControlName="categoryId" class="border px-2 py-1 rounded">
            <option value="" disabled>Choisir une catégorie</option>
            <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.label }}</option>
          </select>
          <input type="color" formControlName="color" class="w-12 h-10 border rounded" />
          <div class="mt-auto flex justify-end gap-2">
            <button type="button" (click)="onClose()" class="px-3 py-1 border rounded">Annuler</button>
            <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" [disabled]="subscriptionForm.invalid">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SubscriptionAddComponent implements OnInit {
  @Input() open = false; // ← Ajouté ici
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AddSubscription>();

  subscriptionForm!: FormGroup;
  categories: Category[] = [];

  private categoryService = inject(CategoryService);

  ngOnInit() {
    this.subscriptionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, positivePriceValidator()]),
      paymentDate: new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
      categoryId: new FormControl('', Validators.required),
      color: new FormControl('#3b82f6'),
    });
    this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAllCategories();
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  onSave() {
    if (!this.subscriptionForm.valid) return;
    this.save.emit(this.subscriptionForm.value);
    this.resetForm();
    this.close.emit();
  }

  private resetForm() {
    this.subscriptionForm.reset({
      name: '',
      price: 0,
      paymentDate: new Date().toISOString().substring(0, 10),
      categoryId: '',
      color: '#3b82f6',
    });
  }
}
