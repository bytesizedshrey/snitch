import { useDispatch } from "react-redux";
import { createProduct, getAllProducts, getSellerProducts } from "../service/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {

    async function handleCreateProduct(formData){
        const dispatch = useDispatch()
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products))
        return data.products
         
    }

    return {handleCreateProduct,handleGetSellerProduct}

}