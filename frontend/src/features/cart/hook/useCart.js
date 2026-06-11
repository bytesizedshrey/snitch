import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchCart, 
    addToCart, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    resetCartState
} from '../state/cart.slice.js';

export const useCart = () => {
    const dispatch = useDispatch();
    const { cartData, loading, error } = useSelector((state) => state.cart);

    const loadCart = useCallback(async () => {
        return await dispatch(fetchCart()).unwrap();
    }, [dispatch]);

    const addItem = useCallback(async (productId, variantId, quantity = 1) => {
        return await dispatch(addToCart({ productId, variantId, quantity })).unwrap();
    }, [dispatch]);

    const updateQuantity = useCallback(async (itemId, quantity) => {
        return await dispatch(updateCartItemQuantity({ itemId, quantity })).unwrap();
    }, [dispatch]);

    const removeItem = useCallback(async (itemId) => {
        return await dispatch(removeFromCart(itemId)).unwrap();
    }, [dispatch]);

    const emptyCart = useCallback(async () => {
        return await dispatch(clearCart()).unwrap();
    }, [dispatch]);

    const clearLocalCartState = useCallback(() => {
        dispatch(resetCartState());
    }, [dispatch]);

    return {
        cartData,
        items: cartData?.items || [],
        loading,
        error,
        loadCart,
        addItem,
        updateQuantity,
        removeItem,
        emptyCart,
        clearLocalCartState
    };
};
