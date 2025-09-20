export interface Subscription {
    id: string;
    userId: string;                     // id de l'utilisateur propriétaire
    name: string;
    category: 'Divertissement' | 'Sport' | 'Musique' | 'Lifestyle' | 'Autre';
    price: number;
    paymentDate: Date;
    color?: string;
    active: boolean;
}

export interface AddSubscription {
    userId: string;                     // id de l'utilisateur propriétaire
    name: string;
    category: 'Divertissement' | 'Sport' | 'Musique' | 'Lifestyle' | 'Autre';
    price: number;
    paymentDate: Date;
    color?: string;
}
