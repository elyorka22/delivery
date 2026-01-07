import { Router } from 'express';
import {
  getRestaurants,
  getRestaurant,
  getMenuItems,
  getAllCategories,
  getMenuItemsByCategory,
} from '../controllers/restaurantController';

const router = Router();

router.get('/', getRestaurants);
router.get('/categories', getAllCategories);
router.get('/category/:category/menu', getMenuItemsByCategory);
router.get('/:id', getRestaurant);
router.get('/:id/menu', getMenuItems);

export default router;



