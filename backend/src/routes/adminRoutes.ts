import { Router } from 'express';
import { getStats, getRestaurants, getUsers, getOrders, createManager, createRestaurant, updateRestaurant, deleteRestaurant } from '../controllers/adminController';
import { 
  getCarouselCategoriesList, 
  createCarouselCategoryItem, 
  updateCarouselCategoryItem, 
  deleteCarouselCategoryItem,
  getAvailableCategories 
} from '../controllers/adminCarouselController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireRole('SUPER_ADMIN'));

router.get('/stats', getStats);
router.get('/restaurants', getRestaurants);
router.post('/restaurants', createRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.post('/managers', createManager);

// Carousel categories routes
router.get('/carousel/categories', getCarouselCategoriesList);
router.get('/carousel/available-categories', getAvailableCategories);
router.post('/carousel/categories', createCarouselCategoryItem);
router.put('/carousel/categories/:id', updateCarouselCategoryItem);
router.delete('/carousel/categories/:id', deleteCarouselCategoryItem);

export default router;

