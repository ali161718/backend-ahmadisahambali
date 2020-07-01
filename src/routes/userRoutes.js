const express = require('express');
const router = express.Router();
const User = require('../models/user');
const redis = require("redis");

const port_redis = process.env.PORT || 6379;
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

const checkCacheId = (req, res, next) => {
    const { id } = req.params;

    redis_client.get(id, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
};

router.get('/users/:id', checkCacheId, async (req, res) => {
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

const checkCacheAccount = (req, res, next) => {
    const { accountNumber } = req.params;

    redis_client.get(accountNumber, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
};

router.get('/users/account/:accountNumber', checkCacheAccount, async (req, res) => {
    try {
        const getAccount = await User.find({ accountNumber: req.params.accountNumber });

        redis_client.setex(req.params.accountNumber, 3600, JSON.stringify(getAccount));

        res.json(getAccount);
    } catch (error) {
        res.json({ message: error });
    }
});

const checkCacheIdentity = (req, res, next) => {
    const { identityNumber } = req.params;

    redis_client.get(identityNumber, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
};

router.get('/users/identity/:identityNumber', checkCacheIdentity, async (req, res) => {
    try {
        const getIdentity = await User.find({ identityNumber: req.params.identityNumber });

        redis_client.setex(req.params.identityNumber, 3600, JSON.stringify(getIdentity));

        res.json(getIdentity);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;