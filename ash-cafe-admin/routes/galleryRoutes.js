const express = require('express');
const {
    createGalleryItemHandler,
    getAllGalleryItemsHandler,
    getGalleryItemByIdHandler,
    updateGalleryItemHandler,
    deleteGalleryItemHandler,
} = require('../controllers/galleryController');  // Adjust to your actual controller path

const router = express.Router();

router.post('/', createGalleryItemHandler);           // Create a new gallery item
router.get('/', getAllGalleryItemsHandler);          // Get all gallery items
router.get('/:id', getGalleryItemByIdHandler);      // Get a gallery item by ID
router.put('/:id', updateGalleryItemHandler);       // Update a gallery item by ID
router.delete('/:id', deleteGalleryItemHandler);    // Delete a gallery item by ID

module.exports = router;
