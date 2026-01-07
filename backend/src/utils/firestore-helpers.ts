// Helper functions for Firestore operations
import { db } from './firebase';
import * as FirebaseFirestore from 'firebase-admin/firestore';

// Lazy check for db - don't throw on import, check on use
function getDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Check Firebase credentials.');
  }
  return db;
}

// Type definitions
export interface FirestoreUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: string;
  avatar?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface FirestoreRestaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  image?: string;
  managerId: string;
  isActive: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface FirestoreMenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface FirestoreOrder {
  id: string;
  userId: string;
  restaurantId: string;
  courierId?: string;
  status: string;
  totalPrice: number;
  address: string;
  phone: string;
  notes?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

// Helper: Convert Firestore Timestamp to Date
export function timestampToDate(timestamp: FirebaseFirestore.Timestamp | Date): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return timestamp.toDate();
}

// Helper: Convert Date to Firestore Timestamp
export function dateToTimestamp(date: Date): FirebaseFirestore.Timestamp {
  return FirebaseFirestore.Timestamp.fromDate(date);
}

// Helper: Get current timestamp
export function getCurrentTimestamp(): FirebaseFirestore.Timestamp {
  return FirebaseFirestore.Timestamp.now();
}

// Helper: Remove undefined properties from object (Firestore doesn't accept undefined)
export function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

// Users collection helpers
function getUsersCollection() {
  return getDb().collection('users');
}

export async function getUserById(id: string): Promise<FirestoreUser | null> {
  const doc = await getUsersCollection().doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as FirestoreUser;
}

export async function getUserByEmail(email: string): Promise<FirestoreUser | null> {
  const snapshot = await getUsersCollection().where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as FirestoreUser;
}

export async function createUser(userData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreUser> {
  const now = getCurrentTimestamp();
  const userRef = getUsersCollection().doc();
  
  // Remove undefined properties before saving
  const cleanUserData = removeUndefined(userData);
  
  const user: Omit<FirestoreUser, 'id'> = {
    ...cleanUserData,
    createdAt: now,
    updatedAt: now,
  } as Omit<FirestoreUser, 'id'>;
  
  await userRef.set(user);
  return { id: userRef.id, ...user };
}

export async function updateUser(id: string, updates: Partial<Omit<FirestoreUser, 'id' | 'createdAt'>>): Promise<FirestoreUser> {
  const userRef = getUsersCollection().doc(id);
  
  // Remove undefined properties before updating
  const cleanUpdates = removeUndefined(updates);
  
  const updateData = {
    ...cleanUpdates,
    updatedAt: getCurrentTimestamp(),
  };
  await userRef.update(updateData);
  const updated = await userRef.get();
  return { id: updated.id, ...updated.data() } as FirestoreUser;
}

// Restaurants collection helpers
function getRestaurantsCollection() {
  return getDb().collection('restaurants');
}

export async function getRestaurantById(id: string): Promise<FirestoreRestaurant | null> {
  const doc = await getRestaurantsCollection().doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as FirestoreRestaurant;
}

export async function getRestaurants(activeOnly: boolean = true): Promise<FirestoreRestaurant[]> {
  let query: FirebaseFirestore.Query = getRestaurantsCollection();
  
  if (activeOnly) {
    query = query.where('isActive', '==', true);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreRestaurant));
}

export async function createRestaurant(restaurantData: Omit<FirestoreRestaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreRestaurant> {
  const now = getCurrentTimestamp();
  const restaurantRef = getRestaurantsCollection().doc();
  const restaurant: Omit<FirestoreRestaurant, 'id'> = {
    ...restaurantData,
    createdAt: now,
    updatedAt: now,
  };
  await restaurantRef.set(restaurant);
  return { id: restaurantRef.id, ...restaurant };
}

export async function updateRestaurant(id: string, updates: Partial<Omit<FirestoreRestaurant, 'id' | 'createdAt'>>): Promise<FirestoreRestaurant> {
  const restaurantRef = getRestaurantsCollection().doc(id);
  const updateData = {
    ...updates,
    updatedAt: getCurrentTimestamp(),
  };
  await restaurantRef.update(updateData);
  const updated = await restaurantRef.get();
  return { id: updated.id, ...updated.data() } as FirestoreRestaurant;
}

export async function deleteRestaurant(id: string): Promise<void> {
  await getRestaurantsCollection().doc(id).delete();
}

// MenuItems collection helpers
function getMenuItemsCollection() {
  return getDb().collection('menuItems');
}

export async function getMenuItemsByRestaurant(restaurantId: string): Promise<FirestoreMenuItem[]> {
  const snapshot = await getMenuItemsCollection()
    .where('restaurantId', '==', restaurantId)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreMenuItem));
}

export async function getMenuItemById(id: string): Promise<FirestoreMenuItem | null> {
  const doc = await getMenuItemsCollection().doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as FirestoreMenuItem;
}

// Orders collection helpers
function getOrdersCollection() {
  return getDb().collection('orders');
}

export async function getOrderById(id: string): Promise<FirestoreOrder | null> {
  const doc = await getOrdersCollection().doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as FirestoreOrder;
}

export async function createOrder(orderData: Omit<FirestoreOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreOrder> {
  const now = getCurrentTimestamp();
  const orderRef = getOrdersCollection().doc();
  const order: Omit<FirestoreOrder, 'id'> = {
    ...orderData,
    createdAt: now,
    updatedAt: now,
  };
  await orderRef.set(order);
  return { id: orderRef.id, ...order };
}

export async function updateOrder(id: string, updates: Partial<Omit<FirestoreOrder, 'id' | 'createdAt'>>): Promise<FirestoreOrder> {
  const orderRef = getOrdersCollection().doc(id);
  const updateData = {
    ...updates,
    updatedAt: getCurrentTimestamp(),
  };
  await orderRef.update(updateData);
  const updated = await orderRef.get();
  return { id: updated.id, ...updated.data() } as FirestoreOrder;
}

// Helper to convert Firestore document to plain object (for API responses)
export function firestoreDocToObject<T extends { id: string; createdAt: FirebaseFirestore.Timestamp | Date; updatedAt: FirebaseFirestore.Timestamp | Date }>(
  doc: T
): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } {
  const { createdAt, updatedAt, ...rest } = doc;
  return {
    ...rest,
    createdAt: timestampToDate(createdAt).toISOString(),
    updatedAt: timestampToDate(updatedAt).toISOString(),
  } as any;
}

