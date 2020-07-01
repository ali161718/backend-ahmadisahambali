const router = require('express').Router();
const Auth = require('../models/auth');
const { registerValidation, loginValidation } = require('../validations/validationAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const isEmailExist = await Auth.findOne({ email: req.body.email });

    if (isEmailExist)
        return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const auth = new Auth({
        name: req.body.name,
        email: req.body.email,
        password,
    })

    try {
        const savedAuth = await auth.save();
        res.json({ error: null, data: savedAuth });
    } catch (err) {
        res.status(400).json({ err });
    }
});

router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const auth = await Auth.findOne({ email: req.body.email });

    if (!auth) return res.status(400).json({ error: "Email is wrong" });

    const validPassword = await bcrypt.compare(req.body.password, auth.password);

    if (!validPassword)
        return res.status(400).json({ error: "Password is wrong" });

    const token = jwt.sign(
        {
            name: auth.name,
            id: auth._id,
        },
        process.env.TOKEN_SECRET
    );

    res.header("auth-token", token).json({
        error: null,
        data: {
            token,
        },
    });
});

module.exports = router;

