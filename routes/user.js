const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/admin-only', auth, async (req, res) => {
    if (!req.user.roles.some(role => role.name === 'Admin')) {
        return res.status(403).send({ error: 'Access denied' });
    }
    res.send({ message: 'Welcome Admin' });
});

module.exports = router;