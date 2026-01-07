export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  COOK = 'COOK',
  COURIER = 'COURIER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  PICKED_UP = 'PICKED_UP',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  image?: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  restaurant?: {
    id: string;
    name: string;
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  courierId?: string;
  status: OrderStatus;
  totalPrice: number;
  address: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  restaurant?: Restaurant;
}



