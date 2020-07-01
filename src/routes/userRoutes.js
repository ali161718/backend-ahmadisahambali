const express = require('express');
const router = express.Router();
const User = require('../models/user');
const redis = require("redis");

const port_redis = process.env.PORT || 6360;
const redis_client = redis.createClient(port_redis);


router.get('/', async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        res.json({ message: error });
    }
});

router.post('/users', async (req, res) => {
    const user = new User({
        userName: req.body.userName,
        accountNumber: req.body.accountNumber,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.json({ message: error })
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const getUser = await User.findById(req.params.id);

        redis_client.setex(req.params.id, 3600, JSON.stringify(getUser));

        res.json(getUser);
    } catch (error) {
        res.json({ message: error });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const removeUser = await User.remove({ _id: req.params.id });
        res.json(removeUser);
    } catch (error) {
        res.json({ message: error });
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const updateUser = await User.update({ _id: req.params.id },
            {
                $set:
                {
                    userName: req.body.userName,
                    accountNumber: req.body.accountNumber,
                    emailAddress: req.body.emailAddress,
                    identityNumber: req.body.identityNumber
                }
            });
        res.json(updateUser);
    } catch (error) {
        res.json({ message: error });
    }
});

router.get('/users/account/:accountNumber', async (req, res) => {
    try {
        const getAccount = await User.find({accountNumber: req.params.accountNumber});
        res.json(getAccount);
    } catch (error) {
        res.json({ message: error });        
    }
});

router.get('/users/identity/:identityNumber', async (req, res) => {
    try {
        const getIdentity = await User.find({identityNumber: req.params.identityNumber});
        res.json(getIdentity);
    } catch (error) {
        res.json({ message: error });        
    }
});

module.exports = router;