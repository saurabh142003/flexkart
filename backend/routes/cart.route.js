import express from 'express'
const router = express.Router();
import { getCartByUserId,addItemToCart,removeItemFromCart, removeCartItem, removeItemQuantity } from '../controllers/cart.controller.js';
import { verifyToken } from '../utils/verifyToken.js';



router.get('/:userId',verifyToken, getCartByUserId);


router.post('/add',verifyToken, addItemToCart);

router.post('/remove',verifyToken, removeItemFromCart);
router.post('/remove/item',verifyToken,removeCartItem );
router.post('/remove/quantity',verifyToken,removeItemQuantity);


export default router
