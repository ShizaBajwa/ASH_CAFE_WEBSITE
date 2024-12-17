const pool = require('../config/db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');  // Use multer for handling file uploads

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Create a new gallery item (image)
const createGalleryItem = async ({ image_url, description }) => {
    const query = `
        INSERT INTO Gallery (image_url, description)
        VALUES ($1, $2) RETURNING *;
    `;
    const values = [image_url, description];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get all gallery items
const getAllGalleryItems = async () => {
    const query = 'SELECT * FROM Gallery;';
    const result = await pool.query(query);
    return result.rows;
};

// Get a gallery item by ID
const getGalleryItemById = async (image_id) => {
    const query = 'SELECT * FROM Gallery WHERE image_id = $1;';
    const result = await pool.query(query, [image_id]);
    return result.rows[0];
};

// Update a gallery item by ID
const updateGalleryItem = async (image_id, { image_url, description }) => {
    const query = `
        UPDATE Gallery
        SET image_url = $1, description = $2
        WHERE image_id = $3
        RETURNING *;
    `;
    const values = [image_url, description, image_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete a gallery item by ID
const deleteGalleryItem = async (image_id) => {
    const query = 'DELETE FROM Gallery WHERE image_id = $1 RETURNING *;';
    const result = await pool.query(query, [image_id]);
    return result.rows[0];
};

module.exports = {
    createGalleryItem,
    getAllGalleryItems,
    getGalleryItemById,
    updateGalleryItem,
    deleteGalleryItem,
    upload,  // Export multer upload function for use in routes
};
