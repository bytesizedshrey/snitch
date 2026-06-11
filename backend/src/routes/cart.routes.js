import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { 
    getCart, 
    addToCart, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart 
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

export default router;
