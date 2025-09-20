import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private users = signal<User[]>([
        {
            id: "1",
            email: 'admin@example.com',
            name: 'admin example',
            password: 'admin123', // En production, ce serait hashé
            role: 'admin',
            createdAt: new Date('2024-01-01'),
        },
        {
            id: "2",
            email: 'user@example.com',
            name: 'user example',
            password: 'user123',
            role: 'user',
            createdAt: new Date('2024-01-02'),
        },
    ]);

    private currentUser = signal<User | null>(null);
    private token = signal<string | null>(null);


    constructor() {
        const userId = localStorage.getItem('currentUserId');
        if (userId) {
            this.initCurrentUser(userId); // Appel d'une méthode async
        }
    }

    private async initCurrentUser(userId: string) {
        const user = await this.getUserById(userId);
        if (user) {
            this.currentUser.set(user);
        }
    }

    // Simuler un délai réseau
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // POST - Connexion
    async login(
        credentials: LoginRequest
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        console.log('🔄 Service: Tentative de connexion...', credentials.email);
        await this.delay(500);

        const user = this.users().find(
            u => u.email === credentials.email && u.password === credentials.password
        );


        if (user) {
            this.currentUser.set(user);
            localStorage.setItem("currentUserId", user.id);
            // Générer un token simulé
            const fakeToken = btoa(`${user.email}:${Date.now()}`);
            this.token.set(fakeToken);
            console.log('✅ Service: Connexion réussie pour:', user.email);
            console.log('🔄 Service: Signal currentUser mis à jour:', this.currentUser());
            return { success: true, user };
        } else {
            console.log('❌ Service: Échec de connexion pour:', credentials.email);
            return { success: false, error: 'Email ou mot de passe incorrect' };
        }
    }

    // POST - Inscription
    async register(
        userData: RegisterRequest
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        console.log("🔄 Service: Tentative d'inscription...", userData.email);
        await this.delay(600);

        // Vérifier si l'email existe déjà
        if (this.users().some(u => u.email === userData.email)) {
            console.log('❌ Service: Email déjà utilisé:', userData.email);
            return { success: false, error: 'Cet email est déjà utilisé' };
        }

        // Vérifier que les mots de passe correspondent
        if (userData.password !== userData.confirmPassword) {
            console.log('❌ Service: Mots de passe différents');
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

        console.log('✅ Service: Inscription réussie pour:', newUser.email);
        console.log('🔄 Service: Signal currentUser mis à jour:', this.currentUser());
        return { success: true, user: newUser };
    }

    // POST - Déconnexion
    async logout(): Promise<void> {
        console.log('🔄 Service: Déconnexion...');
        await this.delay(200);
        this.currentUser.set(null);
        localStorage.removeItem("currentUserId")
        console.log('✅ Service: Déconnexion réussie');
        console.log('🔄 Service: Signal currentUser mis à jour:', this.currentUser());
    }

    // GET - Vérifier si l'utilisateur est connecté
    isAuthenticated(): boolean {
        return this.currentUser() !== null;
    }

    // GET - Récupérer l'utilisateur actuel
    // getCurrentUser(): User | null {
    //     return this.currentUser();
    // }
    getCurrentUser(): User | null {
        // Vérifie si currentUser est déjà défini
        if (this.currentUser()) return this.currentUser();

        // Sinon, regarde dans localStorage
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return null;

        const user = this.users().find(u => u.id === userId) ?? null;
        return user;
    }


    async getUserById(id: string): Promise<User | undefined> {
        await this.delay(200);
        return this.users().find(sub => sub.id === id);
    }

    // GET - Récupérer le token actuel
    getToken(): string | null {
        return this.token();
    }


    // GET - Vérifier si l'utilisateur est admin
    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    // GET - Récupérer tous les utilisateurs (admin seulement)
    async getAllUsers(): Promise<User[]> {
        console.log('🔄 Service: Récupération de tous les utilisateurs...');
        await this.delay(400);

        if (!this.isAdmin()) {
            throw new Error('Accès non autorisé');
        }

        console.log('✅ Service: Utilisateurs récupérés');
        return this.users().map(user => ({
            ...user,
            password: '***', // Masquer les mots de passe
        }));
    }

    // DELETE - Supprimer un utilisateur (admin seulement)
    async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
        console.log('🔄 Service: Suppression de ltilisateur...', userId);
        await this.delay(300);

        if (!this.isAdmin()) {
            console.log('❌ Service: Accès non autorisé');
            return { success: false, error: 'Accès non autorisé' };
        }

        const users = this.users();
        if (!users.some(u => u.id === userId)) {
            console.log('❌ Service: Utilisateur non trouvé');
            return { success: false, error: 'Utilisateur non trouvé' };
        }

        this.users.set(users.filter(u => u.id !== userId));
        console.log('✅ Service: Utilisateur supprimé', userId);
        return { success: true };
    }
}
