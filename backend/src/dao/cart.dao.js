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
            .populate('items.product', 'title price images seller');
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
}

export default new CartDao();
