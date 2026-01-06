import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';
import { hashPassword } from '../utils/password';

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const totalRestaurants = await prisma.restaurant.count();
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: 'DELIVERED',
      },
      _sum: {
        totalPrice: true,
      },
    });
    const totalUsers = await prisma.user.count();

    res.json({
      totalRestaurants,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalUsers,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRestaurants(req: Request, res: Response): Promise<void> {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, address, phone, image, managerId, isActive } = req.body;

    if (!name || !address || !phone) {
      res.status(400).json({ error: 'Name, address and phone are required' });
      return;
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        address,
        phone,
        image,
        managerId: managerId || undefined,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, description, address, phone, image, managerId, isActive } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name,
        description,
        address,
        phone,
        image,
        managerId: managerId || restaurant.managerId,
        isActive: isActive !== undefined ? isActive : restaurant.isActive,
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createManager(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, phone, restaurantId } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password and name are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'MANAGER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Если указан restaurantId, связываем менеджера с рестораном
    if (restaurantId) {
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { managerId: user.id },
      });
    }

    res.status(201).json({ user });
  } catch (error) {
    console.error('Create manager error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
