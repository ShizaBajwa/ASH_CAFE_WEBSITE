const express = require('express');
const {
    createChefHandler,
    getAllChefsHandler,
    getChefByIdHandler,
    updateChefHandler,
    deleteChefHandler,
} = require('../controllers/chefController');

const router = express.Router();

router.post('/', createChefHandler);           // Create a new chef
router.get('/', getAllChefsHandler);          // Get all chefs
router.get('/:id', getChefByIdHandler);      // Get a chef by ID
router.put('/:id', updateChefHandler);       // Update a chef by ID
router.delete('/:id', deleteChefHandler);    // Delete a chef by ID

module.exports = router;
