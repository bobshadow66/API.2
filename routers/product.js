const express = require('express');
const router = express.Router();
const Product = require('../models/product').Product;
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const productList = await Product.find().populate('category');

    if(!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList);
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success: false})
    }
    res.send(product);
})


router.post('/', async (req, res) => {
     const category = await Category.findById(req.body.category);
     if(!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.descreption,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        countInStock: req.body.countInStock,
        isFeatured: req.body.isFeatured,
    });
})
    
    product = await product.save();
    
    if(!product)
    return res.status(500).send('The product cannot be created')

    res.send(product);
    
    router.put('/', async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid Product Id')
        }
        const category = await Category.findById(req.body.category);
        if(!category) return res.status(400).send('Invalid Category')
      
        const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
      
            name: req.body.name,
            description: req.body.descreption,
            richDescription: req.body.richDescription,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            countInStock: req.body.countInStock,
            isFeatured: req.body.isFeatured,
        },
        { new: true}

    })  
        if(!product)
        return res.status(500).send('The product cannot be updated!')
    
        res.send(product);    

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
            const productCount = await Product.countDocuments((count) => count)
            
            if(!product) {
                res.status(500).json({success: false})
            }
            res.send({
                productCount: productCount
            });
        })

        router.get('/get/featured/:count', async (req, res) => {
            const count = req.params.count ? req.params.count : 0
            const products = await Product.find({isFeatured: true})
            
            if(!products) {
                res.status(500).json({success: false})
            }
            res.send(products);
        })
        
        
        

module.exports = router;


