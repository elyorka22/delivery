import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function getRestaurants(req: Request, res: Response): Promise<void> {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { isActive: true },
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

export async function getRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
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

export async function getMenuItems(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: id,
      },
      orderBy: {
        category: 'asc',
      },
    });

    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

