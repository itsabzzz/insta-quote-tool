const express = require('express');
const { rescheduleBooking, cancelBooking } = require('../controllers/businessDashboardController');
const authMiddleware = require('../middleware/authMiddleware'); // Businesses need to be authenticated
const router = express.Router();
const Business = require('../models/Business');  // Add this line


const { createTestBooking } = require('../controllers/businessDashboardController'); // Add this line

// Temporary route for testing booking creation
//router.post('/booking/create', authMiddleware, createTestBooking);

router.post('/business/create', authMiddleware, async (req, res) => {
    const { name, address } = req.body;
  
    try {
      const newBusiness = new Business({ name, address, services: [] });
      await newBusiness.save();
      res.status(201).json({ message: 'Business created', business: newBusiness });
    } catch (error) {
      console.error('Error creating business:', error);  // This should give more details about the error
      res.status(500).json({ error: 'Error creating business' });
    }
  });
  
  

// Reschedule a booking
router.put('/booking/reschedule', authMiddleware, rescheduleBooking);

// Cancel a booking
router.delete('/booking/cancel', authMiddleware, cancelBooking);


//__________________________________________________________________
// Add Pricing and Services Routes
const { addService, updateService, deleteService, getServices } = require('../controllers/businessDashboardController');

// Route to add a service
router.post('/service/add', authMiddleware, addService);

// Route to update a service
router.put('/service/update', authMiddleware, updateService);

// Route to delete a service
router.delete('/service/delete', authMiddleware, deleteService);

// Route to get all services for a business
router.get('/services', authMiddleware, getServices);



module.exports = router;
