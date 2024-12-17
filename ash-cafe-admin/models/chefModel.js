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

// Create a new chef
const createChef = async ({ name, specialty, bio, photo_url }) => {
    const query = `
        INSERT INTO Chefs (name, specialty, bio, image_url)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [name, specialty, bio, photo_url];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get all chefs
const getAllChefs = async () => {
    const query = 'SELECT * FROM Chefs;';
    const result = await pool.query(query);
    return result.rows;
};

// Get a chef by ID
const getChefById = async (chef_id) => {
    const query = 'SELECT * FROM Chefs WHERE chef_id = $1;';
    const result = await pool.query(query, [chef_id]);
    return result.rows[0];
};

// Update a chef by ID
const updateChef = async (chef_id, { name, specialty, bio, photo_url }) => {
    const query = `
        UPDATE Chefs
        SET name = $1, specialty = $2, bio = $3, image_url = $4
        WHERE chef_id = $5
        RETURNING *;
    `;
    const values = [name, specialty, bio, photo_url, chef_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete a chef by ID
const deleteChef = async (chef_id) => {
    const query = 'DELETE FROM Chefs WHERE chef_id = $1 RETURNING *;';
    const result = await pool.query(query, [chef_id]);
    return result.rows[0];
};

module.exports = {
    createChef,
    getAllChefs,
    getChefById,
    updateChef,
    deleteChef,
    upload,  // Export multer upload function for use in routes
};
