const productModel = require('../../db/models/product')
const ErrorHandler = require('../../utils/ErrorHandling')
const catchAsyncError = require('../../middlewares/catchAsyncError')
const ApiFeatures = require('../../utils/apiFeatures')

//CREATE --Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {

    req.body.user = req.user.id;
    
    const product = await productModel.create(req.body)
    res.status(200).json({
        success: true,
        product
    });
});

//GET all product
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = req.query.limit || 5;
    const productCount = await productModel.countDocuments();

    const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    // const products = await productModel.find({})
    const products = await apiFeatures.query 
    res.status(200).json({
        success: true,
        products,
    })

})

//GET product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const id = req.params.id
    const product = await productModel.findById(id)
    if(!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }
    res.status(200).json({
        success: true,
        product,
        // productCount,
    })
})

//PUT product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    const id = req.params.id
    let product = await productModel.findById(id)
    if(!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }
     product = await productModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        // userFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
})

//DELETE product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const id = req.params.id
    const product = await productModel.findById(id)
    if(!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }
  await product.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Product deleted'
  })
})

// Create New Review or Update the review
exports.createProductReview = catchAsyncError(async(req,res,next) => {

    const {rating,comment,productId} = req.body;   
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await productModel.findById(productId);

    const isReviewed = product.reviews.find(
        rev => rev.user.toString() === req.user._id.toString()
        );
    
    if(isReviewed) {
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating),(rev.comment = comment);
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach(rev => {
        avg += rev.rating;
    })

    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
    })

}) 

// Get all review of product
exports.getProductReviews = catchAsyncError(async(req,res,next) => {

    const product = await productModel.findById(req.query.id);

    if(!product) {
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

// Delete review 
exports.deleteReview = catchAsyncError(async(req,res,next) => {

    const product = await productModel.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler("Product not found",404));        
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );
    console.log(req.query.productId)
    let avg = 0;
    
    reviews.forEach((rev) => {
        avg+=rev.rating;
    })

    const ratings = avg/reviews.length;

    const numOfReviews = reviews.length;

    await productModel.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews,
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,

    })
})