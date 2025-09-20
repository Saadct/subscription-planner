// src/app/features/admin/components/category-list.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
        <p class="text-gray-600 mt-2">Créez, modifiez et supprimez les catégories</p>
      </div>

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

      <!-- Liste des catégories -->
      @if (categories().length > 0) {
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actif
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (cat of categories(); track cat.id) {
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">{{ cat.label }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ cat.active ? 'Oui' : 'Non' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    (click)="deleteCategory(cat.id)"
                    class="text-red-600 hover:text-red-900"
                  >
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
  `,
})
export class CategoryListComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  newCategoryLabel = '';

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']); // redirige si non admin
      return;
    }

    await this.loadCategories();
  }

  async loadCategories() {
    const cats = await this.categoryService.getAllCategories();
    this.categories.set(cats);
  }

  async createCategory() {
    if (!this.newCategoryLabel.trim()) return;
    await this.categoryService.createCategory({ label: this.newCategoryLabel });
    this.newCategoryLabel = '';
    await this.loadCategories();
  }

  async deleteCategory(categoryId: string) {
    if (confirm('Supprimer cette catégorie ?')) {
      await this.categoryService.deleteCategory(categoryId);
      await this.loadCategories();
    }
  }
}
