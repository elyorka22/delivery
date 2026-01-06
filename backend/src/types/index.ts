export type UserRole = 'CUSTOMER' | 'SUPER_ADMIN' | 'MANAGER' | 'COOK' | 'COURIER';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
}

