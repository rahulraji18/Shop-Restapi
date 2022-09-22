const orderModel = require('../../db/models/order');
const productModel = require('../../db/models/product');
const ErrorHandler = require('../../utils/ErrorHandling');
const catchAsyncError = require('../../middlewares/catchAsyncError');

// New Order
exports.newOrder = catchAsyncError(async(req,res,next) => {

    const {shippingInfo,
           orderItems,
           paymentInfo,
           itemPrice,
           taxPrice,
           shippingPrice,
           totalPrice, 
          } = req.body;

    const order = await orderModel.create({
           shippingInfo,
           orderItems,
           paymentInfo,
           itemPrice,
           taxPrice,
           shippingPrice,
           totalPrice, 
           paidAt: Date.now(),
           user: req.user._id,
    })

    res.status(201).json({
        success: true,
        order,
    })
})

// Get Single Order 
exports.getSingleOrder = catchAsyncError(async(req,res,next) => {
    
    const order = await orderModel.findById(req.params.id)
                                  .populate("user","name email");

    if(!order) {
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    res.status(200).json({
        success: true,
        order,
    })
})

// Get My Orders
exports.myOrders = catchAsyncError(async(req,res,next) => {
    
    const orders = await orderModel.find({user:req.user._id})


    if(!orders) {
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    res.status(200).json({
        success: true,
        orders,
    })
})

// Get All Orders --Admin
exports.getAllOrders = catchAsyncError(async(req,res,next) => {
    
    const orders = await orderModel.find();

    let totalAmount = 0;

    orders.forEach(orders=> {
        totalAmount += orders.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})

// update Order Status --Admin
exports.updateOrder = catchAsyncError(async(req,res,next) => {
    
    const order = await orderModel.findById(req.params.id)

    if(!order) {
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    if(order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    order.orderItems.forEach(async (o) => {
        await updateStock(o.product,o.quantity);
    })

    order.orderStatus = req.body.status;
    
    if(req.body.status === "Delivered") {
        order.deliveredAt = Date.now(); 
    }

    await order.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
    })
})

async function updateStock(id,quantity) {
    const product = await productModel.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave: false});
}

// Delete Order --Admin
exports.deleteOrder = catchAsyncError(async(req,res,next) => {
    
    const order = await orderModel.findById(req.params.id)

    if(!order) {
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    })
})