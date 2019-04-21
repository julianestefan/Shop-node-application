exports.extractProductFromRequest = req => {
    return {
        title: req.body.title,
        imageUrl: req.file.path,
        price: req.body.price,
        description: req.body.description,
        _id: req.body.productId
    };
}