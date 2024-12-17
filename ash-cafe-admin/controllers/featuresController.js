const pool = require('../config/db'); // Ensure you're using the correct database connection
const path = require('path');
const multer = require('multer');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Append timestamp to avoid name clashes
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage }); // Create multer upload function

// Handler to get all features
const getAllFeaturesHandler = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Features');
        res.status(200).json(result.rows); // Send all features
    } catch (error) {
        console.error('Error fetching features:', error);
        res.status(500).json({ error: 'Failed to fetch features' });
    }
};

// Handler to get a feature by ID
const getFeatureByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Features WHERE feature_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Feature not found' });
        }
        res.status(200).json(result.rows[0]); // Send the feature by ID
    } catch (error) {
        console.error('Error fetching feature by ID:', error);
        res.status(500).json({ error: 'Failed to fetch feature by ID' });
    }
};

// Handler to create a new feature
const createFeatureHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { title, description } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Data to Insert:', { title, description, image_url });

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and Description are required' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO Features (title, description, image_url) VALUES ($1, $2, $3) RETURNING *',
                [title, description, image_url]
            );
            console.log('Insert Result:', result.rows[0]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to create feature' });
        }
    });
};

// Handler to update an existing feature
const updateFeatureHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const featureId = req.params.id; // Feature ID from URL params

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { title, description } = req.body;
        let image_url = req.body.image_url; // Default to existing image URL

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        console.log('Data to Update:', { title, description, image_url });

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and Description are required' });
        }

        try {
            const result = await pool.query(
                'SELECT * FROM Features WHERE feature_id = $1',
                [featureId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Feature not found' });
            }

            const updateResult = await pool.query(
                `UPDATE Features
                SET title = $1, description = $2, image_url = $3
                WHERE feature_id = $4 RETURNING *`,
                [title, description, image_url, featureId]
            );

            console.log('Update Result:', updateResult.rows[0]);
            res.status(200).json(updateResult.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to update feature' });
        }
    });
};

// Handler to delete a feature
const deleteFeatureHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Features WHERE feature_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Feature not found' });
        }
        res.status(200).json({ message: 'Feature deleted successfully' });
    } catch (error) {
        console.error('Error deleting feature:', error);
        res.status(500).json({ error: 'Failed to delete feature' });
    }
};

module.exports = {
    createFeatureHandler,
    getAllFeaturesHandler,
    getFeatureByIdHandler,
    updateFeatureHandler,
    deleteFeatureHandler,
};
