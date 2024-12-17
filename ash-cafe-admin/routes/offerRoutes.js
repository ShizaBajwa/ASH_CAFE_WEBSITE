const express = require('express');
const {
    createOfferHandler,
    getAllOffersHandler,
    getOfferByIdHandler,
    updateOfferHandler,
    deleteOfferHandler,
} = require('../controllers/offerController');

const router = express.Router();

router.post('/', createOfferHandler);           // Create a new chef
router.get('/', getAllOffersHandler);          // Get all chefs
router.get('/:id', getOfferByIdHandler);      // Get a chef by ID
router.put('/:id', updateOfferHandler);       // Update a chef by ID
router.delete('/:id', deleteOfferHandler);    // Delete a chef by ID

module.exports = router;
