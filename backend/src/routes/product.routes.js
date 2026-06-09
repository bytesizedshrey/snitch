import express from 'express'
import { authenticateSeller } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'
import { 
    createProducts, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller.js'

const router = express.Router()

router.post('/', authenticateSeller, upload.array('images'), createProducts)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.put('/:id', authenticateSeller, upload.array('images'), updateProduct)
router.delete('/:id', authenticateSeller, deleteProduct)

export default router