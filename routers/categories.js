/*
routers/categories.js
Name: Aiden Salinas
Date: 07/04/2024
Description: Categories router
*/

// Libs
const express = require('express');
const router = express.Router();
const bcrypt =require('bcryptjs'); 

// Models
const { Category } = require('../models/category');


router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (!categoryList) {
            return res.status(500).json({ success: false });
        }
        res.status(200).send(categoryList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found!' });
        }
        res.status(200).send(category);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.post('/', async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        });
        category = await category.save();
        if (!category) {
            return res.status(400).send('The category cannot be created!');
        }
        res.send(category);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            },
            { new: true }
        );

        if (!category) {
            return res.status(400).send('The category cannot be updated!');
        }
        res.send(category);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found!' });
        }
        res.status(200).json({ success: true, message: 'The category is deleted' });
    } catch (err) {
        res.status(400).json({ success: false, error: err });
    }
});

module.exports = router;
