const express = require('express');
const {
    createFeatureHandler,
    getAllFeaturesHandler,
    getFeatureByIdHandler,
    updateFeatureHandler,
    deleteFeatureHandler,
} = require('../controllers/featuresController'); // Ensure the path is correct

const router = express.Router();

router.post('/', createFeatureHandler);            // Create a new feature
router.get('/', getAllFeaturesHandler);           // Get all features
router.get('/:id', getFeatureByIdHandler);        // Get a feature by ID
router.put('/:id', updateFeatureHandler);         // Update a feature by ID
router.delete('/:id', deleteFeatureHandler);      // Delete a feature by ID

module.exports = router;
