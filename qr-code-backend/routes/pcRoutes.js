const express = require('express');
const { createPc, getPc, updatePc, deletePc } = require('../controllers/pcController'); // Ensure this line is correct
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Define your routes here
router.post('/', authMiddleware, createPc);
router.get('/', getPc);
router.put('/:id', authMiddleware, updatePc);
router.delete('/:id', authMiddleware, deletePc);

module.exports = router;
