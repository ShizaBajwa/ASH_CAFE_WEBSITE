const express = require('express');
const {
    createMenuItemHandler,
    getAllMenuItemsHandler,
    getMenuItemByIdHandler,
    updateMenuItemHandler,
    deleteMenuItemHandler,
} = require('../controllers/menuController');

const router = express.Router();

router.post('/', createMenuItemHandler);           // Create a new menu item
router.get('/', getAllMenuItemsHandler);          // Get all menu items
router.get('/:id', getMenuItemByIdHandler);      // Get a menu item by ID
router.put('/:id', updateMenuItemHandler);       // Update a menu item by ID
router.delete('/:id', deleteMenuItemHandler);    // Delete a menu item by ID

module.exports = router;
