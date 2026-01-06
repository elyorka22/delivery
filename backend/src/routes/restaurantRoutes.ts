import { Router } from 'express';
import {
  getRestaurants,
  getRestaurant,
  getMenuItems,
} from '../controllers/restaurantController';

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.get('/:id/menu', getMenuItems);

export default router;

