import { useDispatch } from "react-redux";
import { createProduct, getSellerProducts } from "../service/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
    const dispatch = useDispatch()

    async function handleCreateProduct(formData){
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products || data))
        return data.products || data
    }

    return {handleCreateProduct,handleGetSellerProduct}
}