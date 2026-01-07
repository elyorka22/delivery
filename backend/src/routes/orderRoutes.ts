import { Router } from 'express';
import { createOrder, getOrders, getOrder } from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);

export default router;



