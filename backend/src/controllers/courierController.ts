import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';
import { OrderStatus } from '../types';
import { getIO } from '../utils/socket';

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const availableOrders = await prisma.order.findMany({
      where: {
        status: 'READY',
        courierId: null,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const myOrders = await prisma.order.findMany({
      where: {
        courierId: userId,
        status: {
          in: ['PICKED_UP', 'DELIVERING'],
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
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json([...availableOrders, ...myOrders]);
  } catch (error) {
    console.error('Get courier orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function takeOrder(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.status !== 'READY') {
      res.status(400).json({ error: 'Order is not ready' });
      return;
    }

    if (order.courierId) {
      res.status(400).json({ error: 'Order already taken' });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        courierId: userId,
        status: 'PICKED_UP',
        statusHistory: {
          create: {
            status: 'PICKED_UP',
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

    getIO().emit('order-status-updated', updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    console.error('Take order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!['PICKED_UP', 'DELIVERING', 'DELIVERED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.courierId !== userId) {
      res.status(403).json({ error: 'Not your order' });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        statusHistory: {
          create: {
            status: status as OrderStatus,
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

    getIO().emit('order-status-updated', updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

