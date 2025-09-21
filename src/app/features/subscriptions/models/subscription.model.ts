export interface Subscription {
    id: string;
    userId: string;
    categoryId: number;
    name: string;
    price: number;
    paymentDate: Date;
    createdAt: Date;     // Date de création de l’abonnement dans le système
    color?: string;
    active: boolean;
}

export interface AddSubscription {
    userId: string;                     // id de l'utilisateur propriétaire
    name: string;
    categoryId: number;
    price: number;
    paymentDate: Date;
    color?: string;
}

export interface UpdateSubscription {
    id: string;
    userId: string;                     // id de l'utilisateur propriétaire
    name: string;
    categoryId: number;
    price: number;
    paymentDate: Date;
    color?: string;
    active: boolean;
}