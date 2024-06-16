const {User} = require ('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userList = await User.find();
        if (!userList) {
            return res.status(500).json({ success: false, message: 'No users found' });
        }
        res.status(200).send(userList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

router.post('/', async (req, res) => {
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.street,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            city: req.body.city,
            country: req.body.country
        });
        user = await user.save();
       
         if (!category) {
            return res.status(400).send('The category cannot be created!');
        }
        res.send(category);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

module.exports = router;