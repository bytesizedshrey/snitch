import axios from 'axios';

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
});

export async function fetchCartApi() {
    const response = await cartApiInstance.get("/");
    return response.data;
}

export async function addToCartApi({ productId, variantId, quantity = 1 }) {
    const response = await cartApiInstance.post("/add", { productId, variantId, quantity });
    return response.data;
}

export async function updateCartItemQuantityApi({ itemId, quantity }) {
    const response = await cartApiInstance.patch(`/item/${itemId}`, { quantity });
    return response.data;
}

export async function removeFromCartApi(itemId) {
    const response = await cartApiInstance.delete(`/item/${itemId}`);
    return response.data;
}

export async function clearCartApi() {
    const response = await cartApiInstance.delete("/clear");
    return response.data;
}

export async function createPaymentOrderApi() {
    const response = await cartApiInstance.post('/create-order');
    return response.data;
}

export async function verifyPaymentApi(paymentDetails) {
    const response = await cartApiInstance.post('/payment/verify/order', paymentDetails);
    return response.data;
}
