import { Router } from 'express';
import { getOrders, updateOrderStatus } from '../controllers/cookController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireRole('COOK'));

router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;

