const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');

// Get, Put, Post, and Delete requests for Orders

router.get('/', async (req, res) => {
    try {
        const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
        if (!orderList) {
            return res.status(500).json({ success: false });
        }
        res.send(orderList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.get('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Order Id');
    }

    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems', populate: {
                    path: 'product', populate: 'category'
                }
            });
        if (!order) {
            return res.status(500).json({ success: false });
        }
        res.send(order);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.post('/', async (req, res) => {
    if (!req.body.orderItems || !Array.isArray(req.body.orderItems)) {
        return res.status(400).json({ success: false, message: 'Invalid order items data' });
    }

    try {
        const orderItemsIds = await Promise.all(req.body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));

        const totalPrices = await Promise.all(orderItemsIds.map(async orderItemId => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        }));

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let order = new Order({
            orderItems: orderItemsIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user
        });

        order = await order.save();

        if (!order) {
            return res.status(400).send('The order cannot be created!');
        }

        res.send(order);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Order Id');
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );

        if (!order) {
            return res.status(400).send('The order cannot be updated!');
        }
        res.send(order);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.delete('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Order Id');
    }

    try {
        const order = await Order.findByIdAndRemove(req.params.id);
        if (order) {
            await Promise.all(order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem);
            }));
            return res.status(200).json({ success: true, message: 'The order has been deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

router.get('/get/totalsales', async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
        ]);

        if (!totalSales.length) {
            return res.status(400).send('The order sales cannot be generated');
        }

        res.send({ totalsales: totalSales.pop().totalsales });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();

        if (!orderCount) {
            return res.status(500).json({ success: false });
        }
        res.send({ orderCount: orderCount });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.get('/get/userorders/:userid', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.userid)) {
        return res.status(400).send('Invalid User Id');
    }

    try {
        const userOrderList = await Order.find({ user: req.params.userid })
            .populate({
                path: 'orderItems', populate: {
                    path: 'product', populate: 'category'
                }
            })
            .sort({ 'dateOrdered': -1 });

        if (!userOrderList) {
            return res.status(500).json({ success: false });
        }
        res.send(userOrderList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

module.exports = router;
