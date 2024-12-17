const pool = require('../config/db');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Use multer for handling file uploads

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Create a new menu item
const createMenuItem = async ({ name, description, price, image_url }) => {
    const query = `
        INSERT INTO MenuItems (name, description, price, image_url)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [name, description, price, image_url];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get all menu items
const getAllMenuItems = async () => {
    const query = 'SELECT * FROM MenuItems;';
    const result = await pool.query(query);
    return result.rows;
};

// Get a menu item by ID
const getMenuItemById = async (item_id) => {
    const query = 'SELECT * FROM MenuItems WHERE item_id = $1;';
    const result = await pool.query(query, [item_id]);
    return result.rows[0];
};

// Update a menu item by ID
const updateMenuItem = async (item_id, { name, description, price, image_url }) => {
    const query = `
        UPDATE MenuItems
        SET name = $1, description = $2, price = $3, image_url = $4
        WHERE item_id = $5
        RETURNING *;
    `;
    const values = [name, description, price, image_url, item_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete a menu item by ID
const deleteMenuItem = async (item_id) => {
    const query = 'DELETE FROM MenuItems WHERE item_id = $1 RETURNING *;';
    const result = await pool.query(query, [item_id]);
    return result.rows[0];
};

module.exports = {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    upload, // Export multer upload function for use in routes
};
