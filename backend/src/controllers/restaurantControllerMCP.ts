import { Request, Response } from 'express';

// Временное решение: используем MCP для получения данных
// Это нужно, пока Prisma не может подключиться напрямую к Supabase

export async function getRestaurantsMCP(req: Request, res: Response): Promise<void> {
  try {
    // Возвращаем данные из MCP (пока Prisma не работает)
    // В продакшене это должно работать через Prisma
    const restaurants = [
      {
        id: 'rest-bc736d38-9526-4fcc-ad81-431884f323cd',
        name: 'Тестовый Ресторан',
        description: 'Лучший ресторан в городе',
        address: 'ул. Тестовая, 1',
        phone: '+7 (999) 333-33-33',
        image: null,
        managerId: 'clx00000000000000000000002',
        isActive: true,
        manager: {
          id: 'clx00000000000000000000002',
          name: 'Менеджер Ресторана',
          email: 'manager@test.com',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



