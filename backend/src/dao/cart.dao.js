import cartModel from '../models/cart.model.js';

class CartDao {
    /**
     * Find cart by user ID
     * @param {String} userId 
     * @returns {Promise<Object|null>}
     */
    async findCartByUser(userId) {
        return await cartModel.findOne({ user: userId });
    }

    /**
     * Find cart by user ID and populate product details
     * @param {String} userId 
     * @returns {Promise<Object|null>}
     */
    async findPopulatedCartByUser(userId) {
        return await cartModel.findOne({ user: userId })
            .populate('items.product', 'title price images seller variants');
    }

    /**
     * Create a new cart for a user
     * @param {String} userId 
     * @returns {Promise<Object>}
     */
    async createCart(userId) {
        return await cartModel.create({ user: userId, items: [] });
    }

    /**
     * Save a modified cart document
     * @param {Object} cartDoc 
     * @returns {Promise<Object>}
     */
    async saveCart(cartDoc) {
        return await cartDoc.save();
    }

    /**
     * Run an aggregation pipeline on the cart collection
     * @param {Array} pipeline 
     * @returns {Promise<Array>}
     */
    async aggregate(pipeline) {
        return await cartModel.aggregate(pipeline);
    }
}

export default new CartDao();
