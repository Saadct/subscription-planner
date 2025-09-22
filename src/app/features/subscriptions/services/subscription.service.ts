import { computed, Injectable, signal } from '@angular/core';
import { Subscription, AddSubscription } from '../models/subscription.model';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private subscriptions = signal<Subscription[]>([

        {
            id: "1",
            userId: "1",
            name: 'Netflix',
            categoryId: 1, // Divertissement
            price: 15.99,
            paymentDate: new Date('2025-09-25'),
            createdAt: new Date('2025-09-20'),
            color: '#e50914',
            active: true
        },
        {
            id: "2",
            userId: "1",
            name: 'Basic Fit',
            categoryId: 1, // Divertissement
            price: 35.99,
            paymentDate: new Date('2025-09-25'),
            createdAt: new Date('2025-09-26'),
            color: '#f1b431ff',
            active: true
        },
        {
            id: "3",
            userId: "1",
            name: 'Piscine',
            categoryId: 1, // Divertissement
            price: 25.99,
            paymentDate: new Date('2025-09-25'),
            createdAt: new Date('2025-09-20'),
            color: '#31b4f1ff',
            active: true
        },
        {
            id: "4",
            userId: "2",
            name: 'Spotify',
            categoryId: 2, // Musique
            price: 9.99,
            paymentDate: new Date('2025-09-21'),
            createdAt: new Date('2025-09-19'),
            color: '#1DB954',
            active: true
        }
    ]);

    readonly activeSubscriptions = computed(() =>
        this.subscriptions().filter(sub => sub.active)
    );
    // Simuler un délai réseau
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // GET - tous les abonnements
    async getAllSubscriptions(): Promise<Subscription[]> {
        await this.delay(300);
        return this.subscriptions();
    }

    // GET - abonnement par ID
    async getSubscriptionById(id: string): Promise<Subscription | undefined> {
        await this.delay(200);
        return this.subscriptions().find(sub => sub.id === id);
    }

    // // Dans SubscriptionService
    // async getSubscriptionsByUserId(userId: string): Promise<Subscription[]> {
    //     await this.delay(200);
    //     return this.subscriptions().filter(sub => sub.userId === userId);
    // }

    getSubscriptionsByUserId(userId: string) {
        return computed(() => this.subscriptions().filter(sub => sub.userId === userId));
    }
    // POST - créer un nouvel abonnement
    async createSubscription(data: AddSubscription): Promise<Subscription> {
        await this.delay(400);
        console.log("service", data);
        const newSub: Subscription = {
            id: Date.now().toString(),
            ...data,
            active: true,
            createdAt: new Date()
        };

        this.subscriptions.update(subs => [...subs, newSub]);
        console.log(this.subscriptions);

        return newSub;
    }

    // PUT - mettre à jour un abonnement
    async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
        await this.delay(300);

        let updatedSub: Subscription | undefined;
        this.subscriptions.update(subs =>
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
    async deleteSubscription(id: string): Promise<boolean> {
        await this.delay(250);

        let deleted = false;
        this.subscriptions.update(subs => {
            const initialLength = subs.length;
            const filtered = subs.filter(sub => sub.id !== id);
            deleted = filtered.length < initialLength;
            return filtered;
        });

        return deleted;
    }

    // Méthodes utilitaires
    getActiveSubscriptions(): Subscription[] {
        return this.subscriptions().filter(sub => sub.active);
    }

    getSubscriptionsByCategory(categoryId: Subscription['categoryId']): Subscription[] {
        return this.subscriptions().filter(sub => sub.categoryId === categoryId);
    }
}
