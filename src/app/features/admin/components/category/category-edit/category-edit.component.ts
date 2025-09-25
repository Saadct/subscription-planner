import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      *ngIf="open"
      (click)="onClose()"
      tabindex="0"
      (keydown.enter)="onClose()"
      (keydown.space)="onClose()"
    ></div>

    <!-- Drawer -->
    <div
      class="fixed top-0 right-0 w-96 h-full bg-white shadow-xl transform transition-transform duration-300 z-50"
      [class.translate-x-full]="!open"
      tabindex="0"
    >
      <div class="p-6 flex flex-col h-full">
        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-3">
          <h2 class="text-lg font-semibold">Modifier la catégorie</h2>
          <button
            (click)="onClose()"
            class="text-gray-500 hover:text-gray-800"
            tabindex="0"
            (keydown.enter)="onClose()"
            (keydown.space)="onClose()"
            aria-label="Fermer"
          >
            ✖
          </button>
        </div>

        <!-- Formulaire -->
        <div class="flex-1 overflow-y-auto py-4">
          <label for="category-label" class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            id="category-label"
            type="text"
            [(ngModel)]="editableCategory.label"
            class="border w-full px-2 py-1 rounded mt-1"
          />

          <label for="category-active" class="block text-sm font-medium text-gray-700 mt-4">Actif</label>
          <input
            id="category-active"
            type="checkbox"
            [(ngModel)]="editableCategory.active"
            class="mt-2"
          />
        </div>

        <!-- Footer -->
        <div class="mt-auto border-t pt-3 flex justify-end gap-2">
          <button
            (click)="onClose()"
            class="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
            tabindex="0"
            (keydown.enter)="onClose()"
            (keydown.space)="onClose()"
          >
            Annuler
          </button>
          <button
            (click)="onSave()"
            class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            tabindex="0"
            (keydown.enter)="onSave()"
            (keydown.space)="onSave()"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CategoryEditComponent implements OnChanges {
  @Input() open = false;
  @Input() category: Category | null = null;

  @Output() closeEvent = new EventEmitter<void>(); // ✅ nom sûr, pas d'alias
  @Output() save = new EventEmitter<Category>();
  @Output() closeDrawner = new EventEmitter<void>(); // ✅ nom sûr, pas d'alias

  editableCategory: Category = { id: '', label: '', active: true };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && this.category) {
      this.editableCategory = { ...this.category };
    }
  }

  onClose() {
    this.closeDrawner.emit();
  }

  onSave() {
    this.save.emit(this.editableCategory);
    this.onClose();
  }
}
