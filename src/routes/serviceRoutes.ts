import express from 'express';
import {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories,
  createCategory,
  createServiceSchema,
  createCategorySchema
} from '../controllers/serviceController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/categories', getCategories);
router.get('/:id', getService);

// Protected routes (Admin/Manager only)
router.use(protect);
router.use(restrictTo('ADMIN', 'MANAGER'));

router.post('/categories', validate(createCategorySchema), createCategory);

router.post('/', validate(createServiceSchema), createService);
router.patch('/:id', updateService);
router.delete('/:id', deleteService);

export default router;

