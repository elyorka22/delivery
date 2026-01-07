import { Request, Response } from 'express';
import { 
  getCarouselCategories,
  createCarouselCategory,
  updateCarouselCategory,
  deleteCarouselCategory,
  getAllCategories,
  firestoreDocToObject 
} from '../utils/firestore-helpers';

export async function getCarouselCategoriesList(req: Request, res: Response): Promise<void> {
  try {
    const categories = await getCarouselCategories();
    const categoriesResponse = categories.map(cat => firestoreDocToObject(cat));
    res.json(categoriesResponse);
  } catch (error: any) {
    console.error('Get carousel categories error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function createCarouselCategoryItem(req: Request, res: Response): Promise<void> {
  try {
    const { category, imageUrl, order } = req.body;

    if (!category || !imageUrl) {
      res.status(400).json({ error: 'Category and imageUrl are required' });
      return;
    }

    const categoryItem = await createCarouselCategory({
      category,
      imageUrl,
      order: order || 0,
    });

    const categoryResponse = firestoreDocToObject(categoryItem);
    res.status(201).json(categoryResponse);
  } catch (error: any) {
    console.error('Create carousel category error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function updateCarouselCategoryItem(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { category, imageUrl, order } = req.body;

    const updates: any = {};
    if (category !== undefined) updates.category = category;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (order !== undefined) updates.order = order;

    const updated = await updateCarouselCategory(id, updates);
    const categoryResponse = firestoreDocToObject(updated);
    res.json(categoryResponse);
  } catch (error: any) {
    console.error('Update carousel category error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function deleteCarouselCategoryItem(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await deleteCarouselCategory(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Delete carousel category error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

export async function getAvailableCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Get available categories error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

