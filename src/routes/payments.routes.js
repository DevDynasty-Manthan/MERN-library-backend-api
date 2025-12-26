import {Router} from 'express'
import {registerOnlinePayment, getPayments,createOrder,verifyPayment} from "../controllers/payments.controller.js"
import authenticateJWT from "../middleware/auth.js";
import {upload} from '../middleware/multer.js'
const router = Router();

router.post('/me',authenticateJWT ,upload.single('screenshot'),registerOnlinePayment)
router.get('/me',authenticateJWT,getPayments)
router.post('/createOrder',authenticateJWT,createOrder)
router.post('/verifyPayment',authenticateJWT,verifyPayment)

export default router