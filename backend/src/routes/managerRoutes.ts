import { Router } from 'express';
import { getStats, getMenu, getOrders, createCook, createCourier, createMenuItem, updateMenuItem, deleteMenuItem, getCategories, getRestaurant, updateRestaurant } from '../controllers/managerController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireRole('MANAGER'));

router.get('/restaurant', getRestaurant);
router.put('/restaurant', updateRestaurant);
router.get('/stats', getStats);
router.get('/menu', getMenu);
router.get('/categories', getCategories);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);
router.get('/orders', getOrders);
router.post('/cooks', createCook);
router.post('/couriers', createCourier);

export default router;

