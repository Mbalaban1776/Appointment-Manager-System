import express from 'express';
import {
  createAppointment,
  getAppointments,
  cancelAppointment,
  createAppointmentSchema
} from '../controllers/appointmentController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

router.use(protect);

router.get('/', getAppointments);
router.post('/', validate(createAppointmentSchema), createAppointment);
router.patch('/:id/cancel', cancelAppointment);

export default router;

