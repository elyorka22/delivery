import { Router } from 'express';
import { getStats, getRestaurants, getUsers, getOrders, createManager, createRestaurant, updateRestaurant, deleteRestaurant } from '../controllers/adminController';
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

export default router;

