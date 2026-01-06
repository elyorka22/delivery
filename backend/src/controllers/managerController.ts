import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';
import { hashPassword } from '../utils/password';

export async function getRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { name, description, address, phone, image } = req.body;

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name,
        description,
        address,
        phone,
        image,
      },
    });

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const totalOrders = await prisma.order.count({
      where: { restaurantId: restaurant.id },
    });

    const totalRevenue = await prisma.order.aggregate({
      where: {
        restaurantId: restaurant.id,
        status: 'DELIVERED',
      },
      _sum: {
        totalPrice: true,
      },
    });

    const pendingOrders = await prisma.order.count({
      where: {
        restaurantId: restaurant.id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING'],
        },
      },
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      pendingOrders,
    });
  } catch (error) {
    console.error('Get manager stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMenu(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: {
        category: 'asc',
      },
    });

    res.json(menuItems);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createMenuItem(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { name, description, price, image, category, isAvailable } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({ error: 'Name, price and category are required' });
      return;
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateMenuItem(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { id } = req.params;
    const { name, description, price, image, category, isAvailable } = req.body;

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    if (!menuItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        image,
        category,
        isAvailable,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteMenuItem(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { id } = req.params;

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    });

    if (!menuItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const categories = await prisma.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    const categoryList = categories.map((c) => c.category);

    res.json(categoryList);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
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
    console.error('Get manager orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCook(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { email, password, name, phone } = req.body;

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
        role: 'COOK',
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

    res.status(201).json({ user });
  } catch (error) {
    console.error('Create cook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCourier(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { managerId: userId },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { email, password, name, phone } = req.body;

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
        role: 'COURIER',
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

    res.status(201).json({ user });
  } catch (error) {
    console.error('Create courier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
