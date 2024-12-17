const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Assuming pool is exported from your database config

// Read operation: Get all users
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT user_id, username, email, is_admin FROM Users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
