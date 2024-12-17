const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// API to retrieve merged Orders and OrderItems data
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                o.order_id, 
                o.user_id, 
                o.phone, 
                o.address, 
                o.order_date,
                oi.order_item_id,
                oi.item_id
            FROM 
                Orders o
            LEFT JOIN 
                OrderItems oi
            ON 
                o.order_id = oi.order_id;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
