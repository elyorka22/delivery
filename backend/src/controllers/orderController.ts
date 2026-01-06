import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';
import { OrderStatus } from '../types';
import { getIO } from '../utils/socket';

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { restaurantId, items, address, phone, notes } = req.body;

    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Invalid order data' });
      return;
    }

    if (!address || !phone) {
      res.status(400).json({ error: 'Address and phone are required' });
      return;
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem || !menuItem.isAvailable) {
        res.status(400).json({ error: `Item ${item.menuItemId} is not available` });
        return;
      }

      if (menuItem.restaurantId !== restaurantId) {
        res.status(400).json({ error: 'All items must be from the same restaurant' });
        return;
      }

      totalPrice += menuItem.price * item.quantity;
      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId,
        status: 'PENDING',
        totalPrice,
        address,
        phone,
        notes,
        items: {
          create: orderItems,
        },
        statusHistory: {
          create: {
            status: 'PENDING' as OrderStatus,
            changedBy: userId,
          },
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
      },
    });

    getIO().emit('new-order', order);

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const role = authReq.user?.role;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    let orders;

    if (role === 'CUSTOMER') {
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          restaurant: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (role === 'SUPER_ADMIN') {
      orders = await prisma.order.findMany({
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
    } else {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const role = authReq.user?.role;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (role !== 'SUPER_ADMIN' && order.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

