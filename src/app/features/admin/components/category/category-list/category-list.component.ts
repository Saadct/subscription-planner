import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CategoryEditComponent } from '../category-edit/category-edit.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryEditComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-4">Gestion des Catégories</h1>

      <!-- Formulaire de création -->
      <div class="mb-6">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          [(ngModel)]="newCategoryLabel"
          class="border px-2 py-1 rounded"
        />
        <button
          (click)="createCategory()"
          class="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Créer
        </button>
      </div>

      <!-- Liste -->
      @if (categories().length > 0) {
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">Nom</th>
              <th class="px-6 py-3 text-left">Actif</th>
              <th class="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (cat of categories(); track cat.id) {
               <tr [class.bg-gray-100]="!cat.active" [class.text-gray-400]="!cat.active">
                <td class="px-6 py-4">{{ cat.label }}</td>
                <td class="px-6 py-4">{{ cat.active ? 'Oui' : 'Non' }}</td>
                <td class="px-6 py-4 flex gap-2">
                  <button (click)="openEdit(cat)" class="text-blue-600 hover:text-blue-900">
                    Modifier
                  </button>
                  <button (click)="deleteCategory(cat.id)" class="text-red-600 hover:text-red-900">
                    Supprimer
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p class="text-gray-500 text-center py-8">Aucune catégorie trouvée</p>
      }
    </div>

    <!-- Drawer d'édition -->
    <app-category-edit
      [open]="drawerOpen"
      [category]="selectedCategory"
      (close)="closeDrawer()"
      (save)="updateCategory($event)"
    ></app-category-edit>
  `,
})
export class CategoryListComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  //categories = signal<Category[]>([]);
  categories = this.categoryService.getCategoriesComputed();

  newCategoryLabel = '';
  drawerOpen = false;
  selectedCategory: Category | null = null;

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/auth']);
      return;
    }
    // await this.loadCategories();
  }

  // async loadCategories() {
  //   this.categories.set(await this.categoryService.getAllCategories());
  // }

  async createCategory() {
    if (!this.newCategoryLabel.trim()) return;
    await this.categoryService.createCategory({ label: this.newCategoryLabel });
    this.newCategoryLabel = '';
    // await this.loadCategories();
  }

  async deleteCategory(categoryId: string) {
    if (confirm('Supprimer cette catégorie ?')) {
      await this.categoryService.deleteCategory(categoryId);
      // await this.loadCategories();
    }
  }

  openEdit(cat: Category) {
    this.selectedCategory = cat;
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  async updateCategory(updated: Category) {
    await this.categoryService.updateCategory(updated.id, updated);
    // await this.loadCategories();
  }
}
