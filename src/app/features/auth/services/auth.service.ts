import { effect, inject, Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { SubscriptionService } from '../../subscriptions/services/subscription.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private subscriptionService = inject(SubscriptionService);

    private users = signal<User[]>([
        { id: '1', email: 'admin@example.com', name: 'admin example', password: 'admin123', role: 'admin', createdAt: new Date('2024-01-01') },
        { id: '2', email: 'user@example.com', name: 'user example', password: 'user123', role: 'user', createdAt: new Date('2024-01-02') },
    ]);

    currentUser = signal<User | null>(null);
    private token = signal<string | null>(null);
    loading = signal(true);


    constructor() {
        const userId = localStorage.getItem('currentUserId');
        if (userId) {
            this.initCurrentUser(userId);
        } else {
            this.loading.set(false);
        }

        effect(() => {
            const user = this.currentUser();
            if (user) {
                localStorage.setItem('currentUserId', user.id);
            } else {
                localStorage.removeItem('currentUserId');
            }
        });

        let previousUserIds = this.users().map(u => u.id);
        effect(() => {
            const currentUserIds = this.users().map(u => u.id);
            const deletedUserIds = previousUserIds.filter(id => !currentUserIds.includes(id));

            deletedUserIds.forEach(id => {
                this.subscriptionService.deleteSubscriptionByUserId(id);
            });

            previousUserIds = currentUserIds;
        });
    }


    private async initCurrentUser(userId: string) {
        const user = await this.getUserById(userId);
        if (user) {
            this.currentUser.set(user);
        }
        this.loading.set(false);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async login(
        credentials: LoginRequest
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        await this.delay(500);
        const user = this.users().find(
            u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
            this.currentUser.set(user);
            const fakeToken = btoa(`${user.email}:${Date.now()}`);
            this.token.set(fakeToken);
            return { success: true, user };
        }

        return { success: false, error: 'Email ou mot de passe incorrect' };
    }

    async register(
        userData: RegisterRequest
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        await this.delay(600);

        if (this.users().some(u => u.email === userData.email)) {
            return { success: false, error: 'Cet email est déjà utilisé' };
        }

        if (userData.password !== userData.confirmPassword) {
            return { success: false, error: 'Les mots de passe ne correspondent pas' };
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            email: userData.email,
            name: userData.name,
            password: userData.password,
            role: 'user',
            createdAt: new Date(),
        };

        this.users.update(users => [...users, newUser]);
        this.currentUser.set(newUser);
        return { success: true, user: newUser };
    }

    async logout(): Promise<void> {
        await this.delay(200);
        this.currentUser.set(null);
    }

    isAuthenticated(): boolean {
        return this.currentUser() !== null;
    }

    getCurrentUser(): User | null {
        if (this.currentUser()) return this.currentUser();
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return null;
        return this.users().find(u => u.id === userId) ?? null;
    }

    async getUserById(id: string): Promise<User | undefined> {
        await this.delay(200);
        return this.users().find(u => u.id === id);
    }

    getToken(): string | null {
        return this.token();
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    async getAllUsers(): Promise<User[]> {
        await this.delay(400);
        if (!this.isAdmin()) throw new Error('Accès non autorisé');
        return this.users().map(user => ({
            ...user,
            password: '***',
        }));
    }

    async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
        await this.delay(300);

        if (!this.isAdmin()) {
            return { success: false, error: 'Accès non autorisé' };
        }

        const users = this.users();
        if (!users.some(u => u.id === userId)) {
            return { success: false, error: 'Utilisateur non trouvé' };
        }

        // Supprime l'utilisateur
        this.users.set(users.filter(u => u.id !== userId));

        // L'effect déclenchera automatiquement la suppression des subscriptions
        return { success: true };
    }
}
