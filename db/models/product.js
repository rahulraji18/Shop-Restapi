const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter price'],
        maxLength: [8, 'price cannot exceed 5 characters']
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    }],
    category: {
        type: String,
        required: [true, 'Please enter category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter stock'],
        maxLength: [4, 'Stock cannot exceed 4 characters'],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [{
         name: {
            type: String,
            required: true,
         },
         rating: {
            type: Number,
            required: true,
         },
         comment: {
            type: String,
            required: true,
         },
         user: {
            type: mongoose.Schema.ObjectId,
            ref: "users",
            required: true,
        }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
    }

},
{
    timestamps: true,
})

module.exports = mongoose.model('products', productSchema);