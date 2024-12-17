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

// Handler to get all gallery items
const getAllGalleryItemsHandler = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Gallery');
        res.status(200).json(result.rows);  // Send all gallery items
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        res.status(500).json({ error: 'Failed to fetch gallery items' });
    }
};

// Handler to get a gallery item by ID
const getGalleryItemByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Gallery WHERE image_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        res.status(200).json(result.rows[0]);  // Send the gallery item by ID
    } catch (error) {
        console.error('Error fetching gallery item by ID:', error);
        res.status(500).json({ error: 'Failed to fetch gallery item by ID' });
    }
};

// Handler to create a new gallery item
const createGalleryItemHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { description } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Data to Insert:', { description, image_url });

        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO Gallery (image_url, description) VALUES ($1, $2) RETURNING *',
                [image_url, description]
            );
            console.log('Insert Result:', result.rows[0]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to create gallery item' });
        }
    });
};

// Handler to update an existing gallery item
const updateGalleryItemHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const imageId = req.params.id;  // Gallery Item ID from URL params

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { description } = req.body;
        let image_url = req.body.image_url; // Default to existing image URL

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        console.log('Data to Update:', { description, image_url });

        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        try {
            const result = await pool.query(
                'SELECT * FROM Gallery WHERE image_id = $1',
                [imageId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Gallery item not found' });
            }

            const updateResult = await pool.query(
                `UPDATE Gallery
                SET image_url = $1, description = $2
                WHERE image_id = $3 RETURNING *`,
                [image_url, description, imageId]
            );

            console.log('Update Result:', updateResult.rows[0]);
            res.status(200).json(updateResult.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to update gallery item' });
        }
    });
};

// Handler to delete a gallery item
const deleteGalleryItemHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Gallery WHERE image_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        res.status(200).json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        res.status(500).json({ error: 'Failed to delete gallery item' });
    }
};

module.exports = {
    createGalleryItemHandler,
    getAllGalleryItemsHandler,
    getGalleryItemByIdHandler,
    updateGalleryItemHandler,
    deleteGalleryItemHandler,
};
