// /backend/controllers/businessDashboardController.js
const Booking = require('../models/Booking'); // Assuming you have a Booking model
const Business = require('../models/Business'); // Import the Business model


// Create Test Booking (Temporary)
//exports.createTestBooking = async (req, res) => {
//    const { businessId, customerId, service, price, time } = req.body;
//  
//    try {
//      const newBooking = new Booking({
//        businessId,
//        customerId,
//        service,
//        price,
//        time,
//        status: 'pending'
//      });
//  
//      await newBooking.save();
//      res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
//    } catch (error) {
//      console.error('Error creating booking:', error);
//      res.status(500).json({ error: 'Error creating booking' });
//    }
//  };

exports.submitBooking = async (req, res) => {
  const { businessId, serviceId, size, condition, bookingTime } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    // Check if the requested time falls within business availability
    const availableSlot = business.availability.find(slot => {
      return (
        slot.day === bookingTime.day &&
        bookingTime.startTime >= slot.startTime &&
        bookingTime.endTime <= slot.endTime
      );
    });

    if (!availableSlot) {
      return res.status(400).json({ error: 'Requested booking time is outside of business availability' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      businessId,
      'bookingTime.day': bookingTime.day,
      $or: [
        { 'bookingTime.startTime': { $lt: bookingTime.endTime, $gte: bookingTime.startTime } },
        { 'bookingTime.endTime': { $gt: bookingTime.startTime, $lte: bookingTime.endTime } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'There is already a booking at the requested time' });
    }

    // Proceed with booking if the time is available and not overlapping
    const newBooking = new Booking({ businessId, serviceId, size, condition, bookingTime });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error submitting booking:', error);
    res.status(500).json({ error: 'Error submitting booking' });
  }
};



// Reschedule Booking
exports.rescheduleBooking = async (req, res) => {
  const { bookingId, newTime } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Update the booking with new time
    booking.time = newTime;
    await booking.save();

    res.status(200).json({ message: 'Booking rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(500).json({ error: 'Error rescheduling booking' });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Error canceling booking' });
  }
};


// Add a Service
//______________________________________________________________________
exports.addService = async (req, res) => {
  const { businessId, serviceName, price, duration } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    business.services.push({ serviceName, price, duration });
    await business.save();

    res.status(201).json({ message: 'Service added successfully', services: business.services });
  } catch (error) {
    console.error('Error adding service:', error);  // Add this for better debugging
    res.status(500).json({ error: 'Error adding service' });
  }
};


// Update a Service
exports.updateService = async (req, res) => {
  const { businessId, serviceId, serviceName, price, duration } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const service = business.services.id(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    service.serviceName = serviceName;
    service.price = price;
    service.duration = duration;
    await business.save();

    res.status(200).json({ message: 'Service updated successfully', services: business.services });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Error updating service' });
  }
};


// Delete a Service
exports.deleteService = async (req, res) => {
  const { businessId, serviceId } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    // Pull the service from the array by its _id
    const service = business.services.id(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    business.services.pull(serviceId);  // Use pull() to remove the service from the array
    await business.save();  // Save the changes to the business document

    res.status(200).json({ message: 'Service deleted successfully', services: business.services });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Error deleting service' });
  }
};


// Get Services
exports.getServices = async (req, res) => {
  const { businessId } = req.query;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    res.status(200).json({ services: business.services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services' });
  }
};


// Add Availability
//_______________________________________________________________________________________________
exports.addAvailability = async (req, res) => {
  const { businessId, day, startTime, endTime } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    business.availability.push({ day, startTime, endTime });
    await business.save();

    res.status(201).json({ message: 'Availability added successfully', availability: business.availability });
  } catch (error) {
    console.error('Error adding availability:', error);
    res.status(500).json({ error: 'Error adding availability' });
  }
};

// Update Availability
exports.updateAvailability = async (req, res) => {
  const { businessId, availabilityId, day, startTime, endTime } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const availability = business.availability.id(availabilityId);
    if (!availability) return res.status(404).json({ error: 'Availability not found' });

    availability.day = day;
    availability.startTime = startTime;
    availability.endTime = endTime;
    await business.save();

    res.status(200).json({ message: 'Availability updated successfully', availability: business.availability });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Error updating availability' });
  }
};

// Delete Availability
exports.deleteAvailability = async (req, res) => {
  const { businessId, availabilityId } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    business.availability.pull(availabilityId);
    await business.save();

    res.status(200).json({ message: 'Availability deleted successfully', availability: business.availability });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Error deleting availability' });
  }
};

// Get Availability
exports.getAvailability = async (req, res) => {
  const { businessId } = req.query;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    res.status(200).json({ availability: business.availability });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Error fetching availability' });
  }
};
