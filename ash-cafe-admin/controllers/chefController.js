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

// Handler to get all chefs
const getAllChefsHandler = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Chefs');
        res.status(200).json(result.rows);  // Send all chefs
    } catch (error) {
        console.error('Error fetching chefs:', error);
        res.status(500).json({ error: 'Failed to fetch chefs' });
    }
};

// Handler to get a chef by ID
const getChefByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Chefs WHERE chef_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Chef not found' });
        }
        res.status(200).json(result.rows[0]);  // Send the chef by ID
    } catch (error) {
        console.error('Error fetching chef by ID:', error);
        res.status(500).json({ error: 'Failed to fetch chef by ID' });
    }
};

// Handler to create a new chef
const createChefHandler = async (req, res) => {
    //for debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Use multer to handle the file upload
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { name, specialty, bio } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Data to Insert:', { name, specialty, bio, image_url });

        if (!name || !specialty) {
            return res.status(400).json({ error: 'Name and Specialty are required' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO Chefs (name, specialty, bio, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, specialty, bio, image_url]
            );
            console.log('Insert Result:', result.rows[0]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to create chef' });
        }
    });
};

// Handler to update an existing chef
const updateChefHandler = async (req, res) => {
    //for debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const chefId = req.params.id;  // Chef ID from URL params

    // Use multer to handle the file upload
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { name, specialty, bio } = req.body;
        let photo_url = req.body.photo_url; // Default to existing photo URL

        if (req.file) {
            photo_url = `/uploads/${req.file.filename}`;
        }

        console.log('Data to Update:', { name, specialty, bio, photo_url });

        if (!name || !specialty) {
            return res.status(400).json({ error: 'Name and Specialty are required' });
        }

        try {
            const result = await pool.query(
                'SELECT * FROM Chefs WHERE chef_id = $1',
                [chefId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Chef not found' });
            }

            const updateResult = await pool.query(
                `UPDATE Chefs
                SET name = $1, specialty = $2, bio = $3, image_url = $4
                WHERE chef_id = $5 RETURNING *`,
                [name, specialty, bio, photo_url, chefId]
            );

            console.log('Update Result:', updateResult.rows[0]);
            res.status(200).json(updateResult.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to update chef' });
        }
    });
};

// Handler to delete a chef
const deleteChefHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Chefs WHERE chef_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Chef not found' });
        }
        res.status(200).json({ message: 'Chef deleted successfully' });
    } catch (error) {
        console.error('Error deleting chef:', error);
        res.status(500).json({ error: 'Failed to delete chef' });
    }
};

module.exports = {
    createChefHandler,
    getAllChefsHandler,
    getChefByIdHandler,
    updateChefHandler,
    deleteChefHandler,
};
