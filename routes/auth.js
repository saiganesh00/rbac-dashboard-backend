const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, roles } = req.body;
    try {
        const user = new User({ username, password });
        if (roles && roles.length > 0) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            user.roles = foundRoles.map(role => role._id);
        }
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).populate('roles');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;