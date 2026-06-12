import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { 
    getCart, 
    addToCart, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    createOrder,
    verifyOrderController
} from '../controllers/cart.controller.js';
import { 
    addToCartValidator, 
    updateCartItemValidator, 
    removeCartItemValidator 
} from '../validator/cart.validator.js';

const router = Router();

// All cart routes require authentication
router.use(authenticateUser);

// Get current user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCartValidator, addToCart);

// Update item quantity
router.patch('/item/:itemId', updateCartItemValidator, updateCartItemQuantity);

// Remove item from cart
router.delete('/item/:itemId', removeCartItemValidator, removeFromCart);

// Clear the entire cart
router.delete('/clear', clearCart);

// Payment routes
router.post('/create-order', createOrder);
router.post('/payment/verify/order', authenticateUser, verifyOrderController);

export default router;
