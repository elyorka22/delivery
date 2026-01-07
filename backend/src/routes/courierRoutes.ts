import { Router } from 'express';
import { getOrders, takeOrder, updateOrderStatus } from '../controllers/courierController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireRole('COURIER'));

router.get('/orders', getOrders);
router.post('/orders/:id/take', takeOrder);
router.put('/orders/:id/status', updateOrderStatus);

export default router;



