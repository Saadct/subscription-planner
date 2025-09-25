import { computed, effect, Injectable, signal, inject } from '@angular/core';
import { AddCategory, Category } from '../models/category.model';
import { SubscriptionService } from '../../subscriptions/services/subscription.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private subscriptionService = inject(SubscriptionService);

    private categories = signal<Category[]>([
        { id: '1', label: 'Divertissement', active: true },
        { id: '2', label: 'Musique', active: true },
        { id: '3', label: 'Sport', active: true },
        { id: '4', label: 'Lecture', active: true },
        { id: '5', label: 'Logiciel', active: true },
        { id: '6', label: 'Jeux vidéo', active: true },
        { id: '7', label: 'Food & Boissons', active: true },
        { id: '8', label: 'Éducation', active: true },
        { id: '9', label: 'Voyage', active: true },
        { id: '10', label: 'Santé & Bien-être', active: true }
    ]);

    allCategories = computed(() => this.categories());

    constructor() {
        let previousCategoryIds = this.allCategories().map(c => c.id);

        effect(() => {
            const currentCategoryIds = this.allCategories().map(c => c.id);
            const deletedCategoryIds = previousCategoryIds.filter(id => !currentCategoryIds.includes(id));

            deletedCategoryIds.forEach(id => {
                this.subscriptionService.deleteSubscriptionByCategoryId(id);
            });

            previousCategoryIds = currentCategoryIds;
        });
    }

    getCategoriesComputed() {
        return computed(() => this.categories());
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getAllCategories(): Promise<Category[]> {
        await this.delay(300);
        return this.categories();
    }

    async getSubscriptionById(id: string): Promise<Category | undefined> {
        await this.delay(200);
        return this.categories().find(sub => sub.id === id);
    }

    async createCategory(data: AddCategory): Promise<Category> {
        await this.delay(400);
        const newSub: Category = {
            id: Date.now().toString(),
            ...data,
            active: true
        };
        this.categories.update(subs => [...subs, newSub]);
        return newSub;
    }

    async updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined> {
        await this.delay(300);
        let updatedSub: Category | undefined;
        this.categories.update(subs =>
            subs.map(sub => {
                if (sub.id === id) {
                    updatedSub = { ...sub, ...updates };
                    return updatedSub;
                }
                return sub;
            })
        );
        return updatedSub;
    }

    async deleteCategory(id: string): Promise<boolean> {
        await this.delay(250);
        let deleted = false;
        this.categories.update(subs => {
            const initialLength = subs.length;
            const filtered = subs.filter(sub => sub.id !== id);
            deleted = filtered.length < initialLength;
            return filtered;
        });
        return deleted;
    }

    getActiveCategories(): Category[] {
        return this.categories().filter(sub => sub.active);
    }
}
