import { computed, Injectable, signal } from '@angular/core';
import { AddCategory, Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categories = signal<Category[]>([
        { id: "1", label: 'Divertissement', active: true }, // Netflix, Disney+
        { id: "2", label: 'Musique', active: true },         // Spotify, Deezer
        { id: "3", label: 'Sport', active: true },          // Basic Fit, piscine
        { id: "4", label: 'Lecture', active: true },        // Kindle, Audible
        { id: "5", label: 'Logiciel', active: true },       // Adobe, Microsoft 365
        { id: "6", label: 'Jeux vidéo', active: true },    // Xbox Game Pass, PS+
        { id: "7", label: 'Food & Boissons', active: true },// Deliveroo, HelloFresh
        { id: "8", label: 'Éducation', active: true },     // Coursera, Masterclass
        { id: "9", label: 'Voyage', active: true },        // Airbnb, Booking
        { id: "10", label: 'Santé & Bien-être', active: true } // Méditation, Yoga
    ]);

    allCategories = computed(() => this.categories());
    getCategoriesComputed() {
        return computed(() => this.categories());
    }
    // Simuler un délai réseau
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // GET - tous les abonnements
    async getAllCategories(): Promise<Category[]> {
        await this.delay(300);
        return this.categories();
    }

    // GET - abonnement par ID
    async getSubscriptionById(id: string): Promise<Category | undefined> {
        await this.delay(200);
        return this.categories().find(sub => sub.id === id);
    }

    // POST - créer un nouvel abonnement
    async createCategory(data: AddCategory): Promise<Category> {
        await this.delay(400);

        const newSub: Category = {
            id: Date.now().toString(),
            ...data,
            active: true,
        };

        this.categories.update(subs => [...subs, newSub]);
        return newSub;
    }

    // PUT - mettre à jour un abonnement
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

    // DELETE - supprimer un abonnement
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

    // Méthodes utilitaires
    getActiveCategories(): Category[] {
        return this.categories().filter(sub => sub.active);
    }

    // getSubscriptionsByLab(categoryId: Subscription['categoryId']): Subscription[] {
    //     return this.categories().filter(sub => sub.categoryId === categoryId);
    // }
}
