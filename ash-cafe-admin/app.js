const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');
const chefRoutes = require('./routes/chefRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const featuresRoutes = require('./routes/featuresRoutes');
const offerRoutes = require('./routes/offerRoutes');
const authRoutes = require('./routes/authRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const db = require('./config/db');


require('dotenv').config();

const app = express();

app.use(express.static('public'));

app.use(cors());
app.use(express.json());

// Route for the index page (admin portal)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the index.html file
});

// Define routes
app.use('/api/menu', menuRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/offer', offerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', userRoutes);

// Add routes for each table

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where uploaded files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Define a route for uploading files (if needed in the future)
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({ message: 'File uploaded successfully!', file: req.file });
});
app.use('/uploads', express.static('uploads'));

// Update chef route should accept file upload
app.post('/api/chefs', upload.single('photo'), async (req, res) => {
    try {
        const { name, specialty, experience, bio, photo_url } = req.body;
        let photo = photo_url;  // Default to photo_url if no file is uploaded

        if (req.file) {
            // If the file was uploaded, store the file path
            photo = `uploads/${req.file.filename}`;
        }

        // Create a new chef record in the database (modify this part according to your DB setup)
        const newChef = await db.query(
            `INSERT INTO chefs (name, specialty, experience, bio, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, specialty, experience, bio, photo]
        );

        res.status(201).json(newChef.rows[0]);
    } catch (error) {
        console.error('Error creating chef:', error);
        res.status(500).json({ message: 'Failed to save chef data' });
    }
});
// POST route for creating a new offer
app.post('/api/offers', upload.single('image'), async (req, res) => {
    try {
        const { title, description, discount, start_date, end_date, status } = req.body;
        let image_url = null;  // Default to null if no file is uploaded

        // Check if a file was uploaded and update the image URL accordingly
        if (req.file) {
            image_url = `uploads/${req.file.filename}`;
        }

        // Insert the new offer into the database (modify this query according to your DB setup)
        const newOffer = await db.query(
            `INSERT INTO Offers (title, description, discount, start_date, end_date, status, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, discount, start_date, end_date, status, image_url]
        );

        res.status(201).json(newOffer.rows[0]);  // Send back the newly created offer
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ message: 'Failed to save offer data' });
    }
});



// Update feature route to accept file upload
app.post('/api/features', upload.single('photo'), async (req, res) => {
    try {
        const { title, description, category, photo_url } = req.body;
        let photo = photo_url;  // Default to existing photo_url if no file is uploaded

        if (req.file) {
            // If a file is uploaded, update the photo to the file's path
            photo = `uploads/${req.file.filename}`;
        }

        // Create a new feature record in the database (modify this part according to your DB setup)
        const newFeature = await db.query(
            `INSERT INTO features (title, description, category, photo_url) VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description, category, photo]
        );

        res.status(201).json(newFeature.rows[0]);
    } catch (error) {
        console.error('Error creating feature:', error);
        res.status(500).json({ message: 'Failed to save feature data' });
    }
});

// Update menu route should accept file upload
// API route for creating a menu item with image upload
app.post('/api/menu', upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, image_url } = req.body;
        let image = image_url;  // Default to image_url if no file is uploaded

        if (req.file) {
            // If the file was uploaded, store the file path
            image = `uploads/${req.file.filename}`;
        }

        // Create a new menu record in the database
        const newMenuItem = await db.query(
            `INSERT INTO MenuItems (image_url, title, price, description) VALUES ($1, $2, $3, $4) RETURNING *`,
            [image, title, price, description]
        );

        res.status(201).json(newMenuItem.rows[0]);  // Send back the newly created menu item
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ message: 'Failed to save menu item data' });
    }
});

// API route for adding a new gallery image
app.post('/api/gallery', upload.single('image'), async (req, res) => {
    try {
        const { description } = req.body;
        let imageUrl = '';

        // If an image file is uploaded, set the image URL
        if (req.file) {
            imageUrl = `uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Insert the new gallery image into the database
        const newImage = await db.query(
            `INSERT INTO Gallery (image_url, description) VALUES ($1, $2) RETURNING *`,
            [imageUrl, description]
        );

        res.status(201).json(newImage.rows[0]);
    } catch (error) {
        console.error('Error adding gallery image:', error);
        res.status(500).json({ message: 'Failed to add gallery image' });
    }
});

const jwt = require('jsonwebtoken');

// Checkout Route - Handles order placement
app.post("/api/checkout", async (req, res) => {
    const { phone, address, cartItems } = req.body;
  
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
  
    // If token is not provided, return Unauthorized error
    if (!token) {
      return res.status(401).json({ message: "User must be logged in to place an order." });
    }
  
    try {
      // Verify the token and extract user data
      const decoded = jwt.verify(token, 'supersecretkey'); // Replace 'your_jwt_secret' with your actual secret
      const username = decoded.username;
  
      const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
   
      const user_id = user.rows[0].user_id

      // Insert the order into Orders table
      const orderQuery = `
        INSERT INTO Orders (user_id, phone, address) 
        VALUES ($1, $2, $3) RETURNING order_id;
      `;
      
      const result = await db.query(orderQuery, [user_id, phone, address]);
      const order_id = result.rows[0].order_id;
  
      // Insert each item from cart into OrderItems table
      const orderItemsQueries = cartItems.map((item) => {
        return db.query(
          `INSERT INTO OrderItems (order_id, item_id) VALUES ($1, $2)`,
          [order_id, item.item_id]
        );
      });
  
      // Wait for all items to be inserted
      await Promise.all(orderItemsQueries);
  
      // Return success message
      res.json({ success: true, message: "Order placed successfully!" });
    } catch (error) {
      console.error("Error placing order:", error);
      
      // If the token is invalid or expired, send Unauthorized error
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
      }
      
      // For other errors, send a generic error response
      res.status(500).json({ message: "Error placing order." });
    }
});
