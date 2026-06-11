import axios from 'axios'

const productApiInstance = axios.create({
    baseURL : "/api/products",
    withCredentials : true,
})

export async function createProduct(formData) {
    const response = await productApiInstance.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export async function getSellerProducts() {
    const response = await productApiInstance.get('/seller')
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get('/')
    return response.data
}

export async function deleteProduct(id) {
    const response = await productApiInstance.delete(`/${id}`)
    return response.data
}

export async function updateProduct(id, formData) {
    const response = await productApiInstance.put(`/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export async function getProductDetails(id) {
    const response = await productApiInstance.get(`/detail/${id}`)
    return response.data
}

export async function addProductVariant(productId, formData) {
    const response = await productApiInstance.post(`/${productId}/variants`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export async function updateProductVariant(productId, variantId, formData) {
    const response = await productApiInstance.put(`/${productId}/variants/${variantId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export async function deleteProductVariant(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`)
    return response.data
}
