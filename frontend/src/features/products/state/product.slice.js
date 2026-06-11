import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name : "product",
    initialState : {
        sellerProducts : [],
        cart: (() => {
            try {
                const savedCart = localStorage.getItem('snitch_cart');
                return savedCart ? JSON.parse(savedCart) : [];
            } catch {
                return [];
            }
        })()
    },
    reducers : {
        setSellerProducts : (state,action) => {
            state.sellerProducts = action.payload
        },
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.cart.find((item) => item.product._id === product._id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({ product, quantity: 1 });
            }
            try {
                localStorage.setItem('snitch_cart', JSON.stringify(state.cart));
            } catch (err) {
                console.error(err);
            }
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.cart = state.cart.filter((item) => item.product._id !== productId);
            try {
                localStorage.setItem('snitch_cart', JSON.stringify(state.cart));
            } catch (err) {
                console.error(err);
            }
        },
        updateCartQuantity: (state, action) => {
            const { productId, amount } = action.payload;
            const item = state.cart.find((item) => item.product._id === productId);
            if (item) {
                item.quantity += amount;
            }
            state.cart = state.cart.filter((item) => item.quantity > 0);
            try {
                localStorage.setItem('snitch_cart', JSON.stringify(state.cart));
            } catch (err) {
                console.error(err);
            }
        },
        clearCart: (state) => {
            state.cart = [];
            try {
                localStorage.setItem('snitch_cart', JSON.stringify([]));
            } catch (err) {
                console.error(err);
            }
        },
        syncCart: (state, action) => {
            const activeProducts = action.payload;
            if (!Array.isArray(activeProducts)) return;
            
            state.cart = state.cart
                .map((item) => {
                    const currentProduct = activeProducts.find((p) => p._id === item.product._id);
                    if (currentProduct) {
                        return {
                            ...item,
                            product: currentProduct
                        };
                    }
                    return item;
                })
                .filter((item) => {
                    return activeProducts.some((p) => p._id === item.product._id) || item.product._id === "default-featured-tech-shell";
                });
                
            try {
                localStorage.setItem('snitch_cart', JSON.stringify(state.cart));
            } catch (err) {
                console.error(err);
            }
        },
        syncSingleProductInCart: (state, action) => {
            const latestProduct = action.payload;
            if (!latestProduct || !latestProduct._id) return;
            
            const index = state.cart.findIndex((item) => item.product._id === latestProduct._id);
            if (index !== -1) {
                state.cart[index].product = latestProduct;
            }
            try {
                localStorage.setItem('snitch_cart', JSON.stringify(state.cart));
            } catch (err) {
                console.error(err);
            }
        }
    }
})

export const { setSellerProducts, addToCart, removeFromCart, updateCartQuantity, clearCart, syncCart, syncSingleProductInCart } = productSlice.actions
export default productSlice.reducer