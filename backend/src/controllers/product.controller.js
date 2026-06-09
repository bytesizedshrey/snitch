import productModel from '../models/product.model.js'
import { uploadFile } from '../service/storage.service.js'

// Create a new product
export async function createProduct(req, res) {
    try {
        const body = req.body || {}
        const { title, description, descriptionAmount, price, priceAmount, priceCurrency, images } = body

        // Accept descriptionAmount as alias for description
        const resolvedDescription = description || descriptionAmount

        // Extract amount and currency from whichever format the client used
        const amount = price?.amount !== undefined ? price.amount : priceAmount
        const currency = price?.currency || priceCurrency || 'INR'

        const missing = []
        if (!title) missing.push('title')
        if (!resolvedDescription) missing.push('description')
        if (amount === undefined || amount === '') missing.push('priceAmount')

        if (missing.length > 0) {
            return res.status(400).json({ 
                message: `Missing required fields: ${missing.join(', ')}.`,
                hint: 'Send form-data with keys: title, description, priceAmount, priceCurrency, images'
            })
        }

        let parsedImages = []

        // Handle file uploads from multer if any
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadFile({
                    buffer: file.buffer,
                    fileName: `${Date.now()}-${file.originalname}`
                })
                parsedImages.push({ url: uploadResult.url })
            }
        }

        // Handle images array from body if any
        if (images) {
            let imagesArray = []
            if (typeof images === 'string') {
                try {
                    imagesArray = JSON.parse(images)
                } catch (e) {
                    imagesArray = [images]
                }
            } else if (Array.isArray(images)) {
                imagesArray = images
            }

            if (Array.isArray(imagesArray)) {
                imagesArray.forEach(img => {
                    if (typeof img === 'string') {
                        parsedImages.push({ url: img })
                    } else if (img && typeof img === 'object' && img.url) {
                        parsedImages.push({ url: img.url })
                    }
                })
            }
        }

        const newProduct = await productModel.create({
            title,
            description: resolvedDescription,
            seller: req.user._id,
            price: {
                amount: Number(amount),
                currency
            },
            images: parsedImages
        })

        return res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        })
    } catch (error) {
        console.error('Create Product Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// Get all products
export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find().populate('seller', 'fullname email')
        return res.status(200).json(products)
    } catch (error) {
        console.error('Get Products Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// Get all products of the authenticated seller
export async function getSellerProducts(req, res) {
    try {
        const products = await productModel.find({ seller: req.user._id }).populate('seller', 'fullname email')
        return res.status(200).json(products)
    } catch (error) {
        console.error('Get Seller Products Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// Get product details by ID
export async function getProductDetails(req, res) {
    try {
        const product = await productModel.findById(req.params.id).populate('seller', 'fullname email')

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        return res.status(200).json(product)
    } catch (error) {
        console.error('Get Product Details Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// Update a product
export async function updateProduct(req, res) {
    try {
        const body = req.body || {}
        const { title, description, price, priceAmount, priceCurrency, images } = body
        const product = await productModel.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Verify that the logged-in seller is the owner of the product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You do not own this product.' })
        }

        if (title) product.title = title
        if (description) product.description = description

        // Update price details defensively
        const amount = price?.amount !== undefined ? price.amount : priceAmount
        const currency = price?.currency || priceCurrency

        if (amount !== undefined) product.price.amount = Number(amount)
        if (currency !== undefined) product.price.currency = currency

        let parsedImages = []

        // Handle file uploads from multer if any
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadFile({
                    buffer: file.buffer,
                    fileName: `${Date.now()}-${file.originalname}`
                })
                parsedImages.push({ url: uploadResult.url })
            }
        }

        // Handle images from body if any
        if (images) {
            let imagesArray = []
            if (typeof images === 'string') {
                try {
                    imagesArray = JSON.parse(images)
                } catch (e) {
                    imagesArray = [images]
                }
            } else if (Array.isArray(images)) {
                imagesArray = images
            }

            if (Array.isArray(imagesArray)) {
                imagesArray.forEach(img => {
                    if (typeof img === 'string') {
                        parsedImages.push({ url: img })
                    } else if (img && typeof img === 'object' && img.url) {
                        parsedImages.push({ url: img.url })
                    }
                })
            }
        }

        // If new images were provided, overwrite product.images
        if (parsedImages.length > 0) {
            product.images = parsedImages
        }

        const updatedProduct = await product.save()

        return res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        })
    } catch (error) {
        console.error('Update Product Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// Delete a product
export async function deleteProduct(req, res) {
    try {
        const product = await productModel.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Verify that the logged-in seller is the owner of the product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You do not own this product.' })
        }

        await productModel.findByIdAndDelete(req.params.id)

        return res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Delete Product Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

// Add product variant
export async function addProductVariant(req, res) {
    try {
        const { productId } = req.params
        const body = req.body || {}
        const { size, color, priceAmount, priceCurrency, stock } = body

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Verify that the logged-in seller is the owner of the product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You do not own this product.' })
        }

        let parsedImages = []

        // Handle file uploads from multer if any
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadFile({
                    buffer: file.buffer,
                    fileName: `${Date.now()}-${file.originalname}`
                })
                parsedImages.push({ url: uploadResult.url })
            }
        }

        const variant = {
            size,
            color,
            price: {
                amount: priceAmount ? Number(priceAmount) : undefined,
                currency: priceCurrency || 'INR'
            },
            stock: stock ? Number(stock) : 0,
            images: parsedImages
        }

        if (!product.variants) {
            product.variants = []
        }
        product.variants.push(variant)
        await product.save()

        return res.status(201).json({
            message: 'Variant added successfully',
            product
        })
    } catch (error) {
        console.error('Add Product Variant Error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}