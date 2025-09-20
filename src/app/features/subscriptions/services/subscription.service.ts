import { Injectable, signal } from '@angular/core';
import { Subscription, AddSubscription } from '../models/subscription.model';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private subscriptions = signal<Subscription[]>([
        {
            id: '1',
            userId: '',
            name: 'Netflix',
            category: 'Divertissement',
            price: 15.99,
            paymentDate: new Date('2025-09-25'),
            color: '#e50914',
            active: true
        },
        {
            id: '3',
            userId: '',
            name: 'basic fit',
            category: 'Divertissement',
            price: 35.99,
            paymentDate: new Date('2025-09-25'),
            color: '#f1b431ff',
            active: true
        },
        {
            id: '4',
            userId: '',
            name: 'piscine',
            category: 'Divertissement',
            price: 25.99,
            paymentDate: new Date('2025-09-25'),
            color: '#31b4f1ff',
            active: true
        },
        {
            id: '2',
            userId: '',
            name: 'Spotify',
            category: 'Musique',
            price: 9.99,
            paymentDate: new Date('2025-09-21'),
            color: '#1DB954',
            active: true
        }
    ]);

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

    async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
        await this.delay(200);
        return this.subscriptions().find(sub => sub.userId === userId);
    }

    // POST - créer un nouvel abonnement
    async createSubscription(data: AddSubscription): Promise<Subscription> {
        await this.delay(400);

        const newSub: Subscription = {
            id: Date.now().toString(),
            ...data,
            active: true
        };

        this.subscriptions.update(subs => [...subs, newSub]);
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

    getSubscriptionsByCategory(category: Subscription['category']): Subscription[] {
        return this.subscriptions().filter(sub => sub.category === category);
    }
}
