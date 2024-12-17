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

// Create a new feature
const createFeature = async ({ title, description, image_url }) => {
    const query = `
        INSERT INTO Features (title, description, image_url)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [title, description, image_url];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get all features
const getAllFeatures = async () => {
    const query = 'SELECT * FROM Features;';
    const result = await pool.query(query);
    return result.rows;
};

// Get a feature by ID
const getFeatureById = async (feature_id) => {
    const query = 'SELECT * FROM Features WHERE feature_id = $1;';
    const result = await pool.query(query, [feature_id]);
    return result.rows[0];
};

// Update a feature by ID
const updateFeature = async (feature_id, { title, description, image_url }) => {
    const query = `
        UPDATE Features
        SET title = $1, description = $2, image_url = $3
        WHERE feature_id = $4
        RETURNING *;
    `;
    const values = [title, description, image_url, feature_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete a feature by ID
const deleteFeature = async (feature_id) => {
    const query = 'DELETE FROM Features WHERE feature_id = $1 RETURNING *;';
    const result = await pool.query(query, [feature_id]);
    return result.rows[0];
};

module.exports = {
    createFeature,
    getAllFeatures,
    getFeatureById,
    updateFeature,
    deleteFeature,
    upload,  // Export multer upload function for use in routes
};
