const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = auth;