import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { UserRole } from '../types';
import { getUserByEmail, createUser, getUserById, firestoreDocToObject } from '../utils/firestore-helpers';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, phone, role } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password and name are required' });
      return;
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    // При регистрации всегда создается только CUSTOMER
    const userRole = 'CUSTOMER';

    const user = await createUser({
      email,
      password: hashedPassword,
      name,
      phone: phone || undefined,
      role: userRole,
      avatar: undefined,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    // Convert Firestore document to API response format
    const userResponse = firestoreDocToObject(user);
    res.status(201).json({
      user: {
        id: userResponse.id,
        email: userResponse.email,
        name: userResponse.name,
        phone: userResponse.phone,
        role: userResponse.role,
        avatar: userResponse.avatar,
        createdAt: userResponse.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    // Convert Firestore document to API response format
    const userResponse = firestoreDocToObject(user);
    res.json({
      user: {
        id: userResponse.id,
        email: userResponse.email,
        name: userResponse.name,
        phone: userResponse.phone,
        role: userResponse.role,
        avatar: userResponse.avatar,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as any;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Convert Firestore document to API response format
    const userResponse = firestoreDocToObject(user);
    res.json({
      user: {
        id: userResponse.id,
        email: userResponse.email,
        name: userResponse.name,
        phone: userResponse.phone,
        role: userResponse.role,
        avatar: userResponse.avatar,
        createdAt: userResponse.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

