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

// Create a new offer
const createOffer = async ({ title, discount, description, image_url }) => {
    const query = `
        INSERT INTO Offers (title, discount, description, image_url)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [title, discount, description, image_url];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get all offers
const getAllOffers = async () => {
    const query = 'SELECT * FROM Offers;';
    const result = await pool.query(query);
    return result.rows;
};

// Get an offer by ID
const getOfferById = async (offer_id) => {
    const query = 'SELECT * FROM Offers WHERE offer_id = $1;';
    const result = await pool.query(query, [offer_id]);
    return result.rows[0];
};

// Update an offer by ID
const updateOffer = async (offer_id, { title, discount, description, image_url }) => {
    const query = `
        UPDATE Offers
        SET title = $1, discount = $2, description = $3, image_url = $4
        WHERE offer_id = $5
        RETURNING *;
    `;
    const values = [title, discount, description, image_url, offer_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete an offer by ID
const deleteOffer = async (offer_id) => {
    const query = 'DELETE FROM Offers WHERE offer_id = $1 RETURNING *;';
    const result = await pool.query(query, [offer_id]);
    return result.rows[0];
};

module.exports = {
    createOffer,
    getAllOffers,
    getOfferById,
    updateOffer,
    deleteOffer,
    upload, // Export multer upload function for use in routes
};
