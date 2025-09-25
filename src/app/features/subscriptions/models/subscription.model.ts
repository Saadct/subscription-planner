export interface Subscription {
    id: string;
    userId: string;
    categoryId: string;
    name: string;
    price: number;
    paymentDate: Date;
    createdAt: Date;
    color?: string;
    active: boolean;
}

export interface AddSubscription {
    userId: string;
    name: string;
    categoryId: string;
    price: number;
    paymentDate: Date;
    color?: string;
}

export interface UpdateSubscription {
    id: string;
    userId: string;
    name: string;
    categoryId: string;
    price: number;
    paymentDate: Date;
    color?: string;
    active: boolean;
}