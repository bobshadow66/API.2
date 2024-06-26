const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) =>{
    const orderlist = await Order.find();

    if(!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

router.post('/', async (req, res) => {
    try {
        const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });

            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));
        
        const orderItemsIdsResolved = await orderItemsIds;
        console.log(orderItemsIds);

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
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

module.exports =router;