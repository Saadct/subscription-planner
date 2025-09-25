import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../../admin/services/category.service';
import { Category } from '../../../admin/models/category.model';
import { Subscription, UpdateSubscription } from '../../models/subscription.model';
import { FormatDatePipe } from '../../../../shared/pipes/format-date/format-date.pipe';
import { positivePriceValidator } from '../../../../shared/validators/price.validator';

@Component({
  selector: 'app-subscription-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormatDatePipe],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      *ngIf="open"
      tabindex="0"
      (click)="onClose()"
      (keyup.enter)="onClose()"
      (keyup.space)="onClose()"
    ></div>

    <div
      class="fixed top-0 right-0 w-96 h-full bg-white shadow-xl transform transition-transform duration-300 z-50"
      [class.translate-x-full]="!open"
    >
      <div class="p-6 flex flex-col h-full">
        <div class="flex justify-between items-center border-b pb-3">
          <h2 class="text-lg font-semibold">Modifier abonnement</h2>
          <button
            type="button"
            (click)="onClose()"
            (keyup.enter)="onClose()"
            (keyup.space)="onClose()"
            class="text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
        </div>

        <form
          [formGroup]="subscriptionForm"
          (ngSubmit)="onSave()"
          class="flex-1 flex flex-col gap-3 py-4"
        >
          <input type="text" formControlName="name" placeholder="Nom de l'abonnement" class="border px-2 py-1 rounded" />
          <input type="number" formControlName="price" placeholder="Prix (€)" class="border px-2 py-1 rounded" />
          <input type="date" formControlName="paymentDate" class="border px-2 py-1 rounded" />
          <p>Date de paiement : {{ subscriptionForm.get('paymentDate')?.value | formatDate }}</p>

          <select formControlName="categoryId" class="border px-2 py-1 rounded">
            <option value="" disabled>Choisir une catégorie</option>
            <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.label }}</option>
          </select>

          <input type="color" formControlName="color" class="w-12 h-10 border rounded" />

          <div class="mt-auto flex justify-end gap-2">
            <button
              type="button"
              (click)="onClose()"
              (keyup.enter)="onClose()"
              (keyup.space)="onClose()"
              class="px-3 py-1 border rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              [disabled]="subscriptionForm.invalid"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SubscriptionEditComponent implements OnChanges, OnInit {
  @Input() open = false;
  @Input() initialData!: Subscription | null;
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() update = new EventEmitter<UpdateSubscription>();

  subscriptionForm!: FormGroup;
  categories: Category[] = [];
  private categoryService = inject(CategoryService);

  constructor() {
    this.subscriptionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, positivePriceValidator()]),
      paymentDate: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
      color: new FormControl('#3b82f6'),
      active: new FormControl(true)
    });
  }

  async ngOnInit() {
    this.categories = await this.categoryService.getAllCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData) {
      this.subscriptionForm.patchValue({
        name: this.initialData.name,
        price: this.initialData.price,
        paymentDate: this.initialData.paymentDate.toISOString().substring(0, 10),
        categoryId: this.initialData.categoryId,
        color: this.initialData.color || '#3b82f6',
        active: this.initialData.active
      });
    }
    if (this.open && !this.initialData) {
      this.resetForm();
    }
  }

  onClose() {
    this.resetForm();
    this.closeDrawer.emit();
  }

  onSave() {
    if (!this.subscriptionForm.valid || !this.initialData) return;

    const formValue = this.subscriptionForm.value;
    const updatedSubscription: UpdateSubscription = {
      id: this.initialData.id,
      userId: this.initialData.userId,
      name: formValue.name,
      price: +formValue.price,
      paymentDate: new Date(formValue.paymentDate),
      categoryId: +formValue.categoryId,
      color: formValue.color,
      active: formValue.active
    };

    this.update.emit(updatedSubscription);
    this.closeDrawer.emit();
  }

  private resetForm() {
    this.subscriptionForm.reset({
      name: '',
      price: 0,
      paymentDate: new Date().toISOString().substring(0, 10),
      categoryId: '',
      color: '#3b82f6',
      active: true
    });
  }
}
