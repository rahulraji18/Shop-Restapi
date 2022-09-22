const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    shippingInfo: {

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },

        pincode: {
            type: Number,
            required: true,
        },
        phno: {
            type: Number,
            required: true,
        },
    },

    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "products",
                required: true,
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
    },

    paymentInfo: {
        id: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            required: true,
        },
    },

    paidAt: {
        type: Date,
        required: true,
    },

    itemPrice: {
        type: Number,
        defalult: 0,
        required: true,
    },

    taxPrice: {
        type: Number,
        defalult: 0,
        required: true,
    },

    shippingPrice: {
        type: Number,
        defalult: 0,
        required: true,
    },

    totalPrice: {
        type: Number,
        default: 0,
        required: true,
    },

    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },

    deliveredAt: {
        type: Date,
    }

},
{
    timestamps: true,
})

module.exports = mongoose.model('orders', orderSchema);