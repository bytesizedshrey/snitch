import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { createProduct, getSellerProducts } from "../service/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
    const dispatch = useDispatch()

    const handleCreateProduct = useCallback(async (formData) => {
        const data = await createProduct(formData)
        return data.product
    }, []);

    const handleGetSellerProduct = useCallback(async () => {
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products || data))
        return data.products || data
    }, [dispatch]);

    return {handleCreateProduct, handleGetSellerProduct}
}