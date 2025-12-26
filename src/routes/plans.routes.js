import {Router} from 'express';
import {getPlans,updatePlan,createPlan ,deletePlan} from '../controllers/plan.controller.js';
import authenticateJWT from '../middleware/auth.js';
import authorizeRoles from '../middleware/adminAuth.js';
const router = Router();
router.get('/', authenticateJWT, getPlans);

router.post('/', authenticateJWT, authorizeRoles('admin'), createPlan);

router.put('/:id', authenticateJWT, authorizeRoles('admin'), updatePlan);

router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deletePlan);

export default router;