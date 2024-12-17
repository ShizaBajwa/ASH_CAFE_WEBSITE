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

// Handler to get all menu items
const getAllMenuItemsHandler = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM MenuItems');
        res.status(200).json(result.rows);  // Send all menu items
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
};

// Handler to get a menu item by ID
const getMenuItemByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM MenuItems WHERE item_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json(result.rows[0]);  // Send the menu item by ID
    } catch (error) {
        console.error('Error fetching menu item by ID:', error);
        res.status(500).json({ error: 'Failed to fetch menu item by ID' });
    }
};

// Handler to create a new menu item
const createMenuItemHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { name, description, price } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Data to Insert:', { name, description, price, image_url });

        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Name, Description, and Price are required' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO MenuItems (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, description, price, image_url]
            );
            console.log('Insert Result:', result.rows[0]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to create menu item' });
        }
    });
};

// Handler to update an existing menu item
const updateMenuItemHandler = async (req, res) => {
    // For debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const menuItemId = req.params.id;  // Menu Item ID from URL params

    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        const { name, description, price } = req.body;
        let image_url = req.body.image_url; // Default to existing image URL

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        console.log('Data to Update:', { name, description, price, image_url });

        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Name, Description, and Price are required' });
        }

        try {
            const result = await pool.query(
                'SELECT * FROM MenuItems WHERE item_id = $1',
                [menuItemId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Menu item not found' });
            }

            const updateResult = await pool.query(
                `UPDATE MenuItems
                SET name = $1, description = $2, price = $3, image_url = $4
                WHERE item_id = $5 RETURNING *`,
                [name, description, price, image_url, menuItemId]
            );

            console.log('Update Result:', updateResult.rows[0]);
            res.status(200).json(updateResult.rows[0]);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ error: 'Failed to update menu item' });
        }
    });
};

// Handler to delete a menu item
const deleteMenuItemHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM MenuItems WHERE item_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};

module.exports = {
    createMenuItemHandler,
    getAllMenuItemsHandler,
    getMenuItemByIdHandler,
    updateMenuItemHandler,
    deleteMenuItemHandler,
};
