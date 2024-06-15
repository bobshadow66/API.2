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

module.exports = router;