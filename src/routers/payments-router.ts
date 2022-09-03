import { Router } from 'express';
import * as paymentsController from '@/controllers/payments-controller';
import { validateBody } from '@/middlewares/validation-middleware';
import { registerPaymentSchema } from '@/schemas/payments-schemas';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(registerPaymentSchema), paymentsController.registerPayment);

export { paymentsRouter };
