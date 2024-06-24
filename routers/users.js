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

router.put('/:id',async (req,res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = userExist.passwordHash;
    } else {
        newPassword = userExist.passwordHash; 
    }
})

const user = await User.findByIdAndUpdate(
    req.params.id,
    {   
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
    },
    { new: true}
)

 if(!user)
 return res.status(400).send('the user cannot be created!')
 
 res.send(user);


// User login
router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = proccess.env.secret;
    try {
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
             const token = jwt.sign(
                {
                   userId: user.id,
                   isAdmin: user.isAdmin
                },
                secret,
                {expiresIn : '1d'}  
             )

            return res.status(200).send({user: user.email , token: token});
        } else {
            return res.status(400).send('Invalid password');
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});


router.post('/register', async (req,res))=>{
    let user = new User ({
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
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created')
    
    res.send(user); 
}

module.exports = router;
