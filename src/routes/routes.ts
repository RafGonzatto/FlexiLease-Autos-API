import express from 'express';
import carRoutes from './car.routes';
import reserveRoutes from './reserve.routes';
import userRoutes from './user.routes';

const router = express.Router();

router.use('/api/v1/', carRoutes);
router.use('/api/v1/', reserveRoutes);
router.use('/api/v1/', userRoutes);

export default router;
