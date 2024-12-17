const pool = require('../config/db');  // Ensure you're using the correct database connection
const path = require('path');
const multer = require('multer');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);  // Append timestamp to avoid name clashes
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });  // Create multer upload function

// Handler to get all offers
const getAllOffersHandler = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Offers');
        res.status(200).json(result.rows);  // Send all offers
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
};

// Handler to get an offer by ID
const getOfferByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Offers WHERE offer_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(200).json(result.rows[0]);  // Send the offer by ID
    } catch (error) {
        console.error('Error fetching offer by ID:', error);
        res.status(500).json({ error: 'Failed to fetch offer by ID' });
    }
};

// Handler to create a new offer
const createOfferHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { title, discount, description } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Data to Insert:', { title, discount, description, image_url });

        if (!title || !discount || !description) {
            return res.status(400).json({ error: 'Title, Discount, and Description are required' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO Offers (title, discount, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [title, discount, description, image_url]
            );
            console.log('Insert Result:', result.rows[0]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to create offer' });
        }
    });
};

// Handler to update an existing offer
const updateOfferHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const offerId = req.params.id;  // Offer ID from URL params

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { title, discount, description } = req.body;
        let image_url = req.body.image_url; // Default to existing image URL

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        console.log('Data to Update:', { title, discount, description, image_url });

        if (!title || !discount || !description) {
            return res.status(400).json({ error: 'Title, Discount, and Description are required' });
        }

        try {
            const result = await pool.query(
                'SELECT * FROM Offers WHERE offer_id = $1',
                [offerId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Offer not found' });
            }

            const updateResult = await pool.query(
                `UPDATE Offers
                SET title = $1, discount = $2, description = $3, image_url = $4
                WHERE offer_id = $5 RETURNING *`,
                [title, discount, description, image_url, offerId]
            );

            console.log('Update Result:', updateResult.rows[0]);
            res.status(200).json(updateResult.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to update offer' });
        }
    });
};

// Handler to delete an offer
const deleteOfferHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Offers WHERE offer_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ error: 'Failed to delete offer' });
    }
};

module.exports = {
    createOfferHandler,
    getAllOffersHandler,
    getOfferByIdHandler,
    updateOfferHandler,
    deleteOfferHandler,
};
