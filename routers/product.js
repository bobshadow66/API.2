/*
router/product.js
Name: Aiden Salinas
Date: 07/04/2024
Description: Products model.
*/

// Libs
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// Models
const { Product } = require('../models/product');
const { Category } = require('../models/category'); 

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'png',
    'image/jpg': 'png'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uplaodError = null
        }

        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
           
        const fileName = file.originalname.replace(/\s+/g, '-');
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, '${filename}-${Date.now{}}.${extension}')
    }
});

const uploadOptions = multer({ storage: storage });

// Get, Put, Post, and Delete requests for Product
router.get('/', async (req, res) => {
    let filter = {};

    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    try {
        const productList = await Product.find(filter).populate('category');
        
        if (!productList) {
            return res.status(500).json({ success: false });
        }

        res.send(productList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');

        if (!product) {
            return res.status(500).json({ success: false });
        }

        res.send(product);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');
        
        const file = req.file;
        if(!file) return res.status(400).send('Invalid Category')
        
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            countInStock: req.body.countInStock,
            isFeatured: req.body.isFeatured,
            image: `${basePath}${fileName}`
        });

        product = await product.save();

        if (!product) {
            return res.status(500).send('The product cannot be created');
        }

        res.send(product);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }

    try {
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                countInStock: req.body.countInStock,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).send('The product cannot be updated!');
        }

        res.send(product);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (product) {
            return res.status(200).json({ success: true, message: 'The product is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();

        if (!productCount) {
            return res.status(500).json({ success: false });
        }
        res.send({
            productCount: productCount
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    try {
        const products = await Product.find({ isFeatured: true }).limit(+count);

        if (!products) {
            return res.status(500).json({ success: false });
        }

        res.send(products);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    try {
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        
        if (files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).send('The product cannot be updated!');
        }

        res.send(product);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

module.exports = router;




