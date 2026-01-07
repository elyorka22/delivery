import { Request, Response } from 'express';
import { 
  getRestaurants as getRestaurantsFromFirestore, 
  getRestaurantById, 
  getUserById, 
  getMenuItemsByRestaurant,
  firestoreDocToObject 
} from '../utils/firestore-helpers';

export async function getRestaurants(req: Request, res: Response): Promise<void> {
  try {
    const restaurants = await getRestaurantsFromFirestore(true);
    
    // Get manager info for each restaurant
    const restaurantsWithManagers = await Promise.all(
      restaurants.map(async (restaurant) => {
        const manager = restaurant.managerId ? await getUserById(restaurant.managerId) : null;
        const restaurantResponse = firestoreDocToObject(restaurant);
        return {
          ...restaurantResponse,
          manager: manager ? {
            id: manager.id,
            name: manager.name,
            email: manager.email,
          } : null,
        };
      })
    );

    res.json(restaurantsWithManagers);
  } catch (error: any) {
    console.error('Get restaurants error:', error);
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

export async function getRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const restaurant = await getRestaurantById(id);

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    // Get manager info
    const manager = restaurant.managerId ? await getUserById(restaurant.managerId) : null;
    const restaurantResponse = firestoreDocToObject(restaurant);
    
    res.json({
      ...restaurantResponse,
      manager: manager ? {
        id: manager.id,
        name: manager.name,
        email: manager.email,
      } : null,
    });
  } catch (error: any) {
    console.error('Get restaurant error:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function getMenuItems(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const menuItems = await getMenuItemsByRestaurant(id);
    
    // Sort by category
    menuItems.sort((a, b) => a.category.localeCompare(b.category));
    
    // Convert to API response format
    const menuItemsResponse = menuItems.map(item => firestoreDocToObject(item));

    res.json(menuItemsResponse);
  } catch (error: any) {
    console.error('Get menu items error:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function getAllCategories(req: Request, res: Response): Promise<void> {
  try {
    const { getAllCategories: getAllCategoriesFromFirestore } = await import('../utils/firestore-helpers');
    const categories = await getAllCategoriesFromFirestore();
    res.json(categories);
  } catch (error: any) {
    console.error('Get all categories error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function getMenuItemsByCategory(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.params;
    const { getMenuItemsByCategory: getMenuItemsByCategoryFromFirestore, firestoreDocToObject } = await import('../utils/firestore-helpers');
    
    const menuItems = await getMenuItemsByCategoryFromFirestore(category);
    
    // Get restaurant info for each menu item
    const menuItemsWithRestaurants = await Promise.all(
      menuItems.map(async (item) => {
        const { getRestaurantById } = await import('../utils/firestore-helpers');
        const restaurant = item.restaurantId ? await getRestaurantById(item.restaurantId) : null;
        const itemResponse = firestoreDocToObject(item);
        return {
          ...itemResponse,
          restaurant: restaurant ? {
            id: restaurant.id,
            name: restaurant.name,
          } : null,
        };
      })
    );

    res.json(menuItemsWithRestaurants);
  } catch (error: any) {
    console.error('Get menu items by category error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}


