const express = require('express');
const { submitBooking, rescheduleBooking, cancelBooking } = require('../controllers/businessDashboardController');
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
  
  
// Add the route for creating a booking
router.post('/booking/create', authMiddleware, submitBooking);

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



//__________________________________________________________________
// availabilty
const { addAvailability, updateAvailability, deleteAvailability, getAvailability } = require('../controllers/businessDashboardController');

// Route to add availability
router.post('/availability/add', authMiddleware, addAvailability);

// Route to update availability
router.put('/availability/update', authMiddleware, updateAvailability);

// Route to delete availability
router.delete('/availability/delete', authMiddleware, deleteAvailability);

// Route to get all availability for a business
router.get('/availability', authMiddleware, getAvailability);



module.exports = router;
