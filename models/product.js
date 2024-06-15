const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true
    }, 
    richDescription: {
         type: String,
         default: ''
    },
    image: {
        type: String,
        default: ''
    },

    image: [{
      type: String 
    }],
    brand: {
        type: String,
        deafult: ''
    },
    
    price: {
        type: Number,
        deafult:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Category',
        required:true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        deafult: 0,
    },
    isFeatured: {
        type: Boolean,
        deafult: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);
