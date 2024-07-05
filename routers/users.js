const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Get all users
router.get('/', async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');
        if (!userList.length) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }
        res.status(200).send(userList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        });
        user = await user.save();
        if (!user) {
            return res.status(400).send('The user cannot be created!');
        }
        res.status(201).send(user);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Update user by ID
router.put('/:id', async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        let newPassword;
        if (req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10);
        } else {
            newPassword = userExist.passwordHash;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country
            },
            { new: true }
        );

        if (!user) return res.status(400).send('The user cannot be updated!');

        res.send(user);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const secret = process.env.SECRET;
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                { expiresIn: '1d' }
            );

            return res.status(200).send({ user: user.email, token: token });
        } else {
            return res.status(400).send('Invalid password');
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Register a new user
router.post('/register', async (req, res) => {
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        });

        user = await user.save();

        if (!user) {
            return res.status(400).send('The user cannot be created');
        }

        res.send(user);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Get user count
router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();

        if (userCount === 0) {
            return res.status(500).json({ success: false });
        }

        res.send({ userCount: userCount });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (user) {
            return res.status(200).json({ success: true, message: 'The user is deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

module.exports = router;

