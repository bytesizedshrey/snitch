import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    fetchCartApi, 
    addToCartApi, 
    updateCartItemQuantityApi, 
    removeFromCartApi, 
    clearCartApi 
} from "../service/cart.api";

// Async Thunks
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchCartApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, variantId, quantity }, { rejectWithValue }) => {
        try {
            const data = await addToCartApi({ productId, variantId, quantity });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
        }
    }
);

export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const data = await updateCartItemQuantityApi({ itemId, quantity });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (itemId, { rejectWithValue }) => {
        try {
            const data = await removeFromCartApi(itemId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove item");
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const data = await clearCartApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartData: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetCartState: (state) => {
            state.cartData = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // addToCart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateCartItemQuantity
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload;
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // removeFromCart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // clearCart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload.cart; // Clear cart returns { message, cart }
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
