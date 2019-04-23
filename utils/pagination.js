const ITEMS_PER_PAGE = 2;

/**
 * Paginate a list of items 
 * @async
 * @param {Number} page - The number of page which the user requires.
 * @param {MongooseObject} model - A mongoose model object.
 * @return {Array} An array which contains the paginated items in its first element, 
 * the total ammount of items in the second element and the items per page in the third
 * element .  
 */
module.exports = async (page, model) => {
    try {
        const totalProducts = await model.find().countDocuments();
        const products = await model.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        return [products, totalProducts, ITEMS_PER_PAGE];
    }catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        throw error;
    }
}