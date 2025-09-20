export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
    createdAt: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
