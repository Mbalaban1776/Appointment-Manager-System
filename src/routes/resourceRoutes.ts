import express from 'express';
import {
  getAllResources,
  createEquipment,
  createPersonnelResource,
  deleteResource,
  createEquipmentSchema,
  createPersonnelResourceSchema
} from '../controllers/resourceController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

router.use(protect);

router.get('/', getAllResources);

router.use(restrictTo('ADMIN', 'MANAGER'));
router.post('/equipment', validate(createEquipmentSchema), createEquipment);
router.post('/personnel', validate(createPersonnelResourceSchema), createPersonnelResource);
router.delete('/:id', deleteResource);

export default router;

