import productModel from '../models/product.model.js';

class ProductDao {
    /**
     * Create a new product
     * @param {Object} productData 
     * @returns {Promise<Object>}
     */
    async createProduct(productData) {
        return await productModel.create(productData);
    }

    /**
     * Get all products, populated with seller details
     * @returns {Promise<Array>}
     */
    async findAllProducts() {
        return await productModel.find().populate('seller', 'fullname email');
    }

    /**
     * Get products by seller ID
     * @param {String} sellerId 
     * @returns {Promise<Array>}
     */
    async findProductsBySeller(sellerId) {
        return await productModel.find({ seller: sellerId }).populate('seller', 'fullname email');
    }

    /**
     * Find a product by its ID
     * @param {String} productId 
     * @returns {Promise<Object|null>}
     */
    async findProductById(productId) {
        return await productModel.findById(productId).populate('seller', 'fullname email');
    }

    /**
     * Update a product by ID
     * @param {String} productId 
     * @param {Object} updateData 
     * @returns {Promise<Object|null>}
     */
    async updateProduct(productId, updateData) {
        return await productModel.findByIdAndUpdate(
            productId, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('seller', 'fullname email');
    }

    /**
     * Delete a product by ID
     * @param {String} productId 
     * @returns {Promise<Object|null>}
     */
    async deleteProduct(productId) {
        return await productModel.findByIdAndDelete(productId);
    }

    /**
     * Save a modified product document (useful for variants)
     * @param {Object} productDoc - The Mongoose document instance
     * @returns {Promise<Object>}
     */
    async saveProductDocument(productDoc) {
        return await productDoc.save();
    }
}

export default new ProductDao();
