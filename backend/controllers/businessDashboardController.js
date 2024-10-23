const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Booking = require('../models/Booking');
const Business = require('../models/Business');

// 1. Signup Function
exports.businessSignup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ error: 'Business already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBusiness = new Business({
      email,
      password: hashedPassword,
      name,
    });

    await newBusiness.save();

    const token = jwt.sign({ businessId: newBusiness._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, businessId: newBusiness._id });
  } catch (error) {
    res.status(500).json({ error: 'Error during signup' });
  }
};

// 2. Login Function
exports.businessLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the business exists
    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token if login is successful
    const token = jwt.sign({ businessId: business._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, businessId: business._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// 3. Get Bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

// 4. Submit Booking
exports.submitBooking = async (req, res) => {
  const { businessId, serviceId, size, condition, bookingTime, customerEmail } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      businessId,
      "bookingTime.day": bookingTime.day,
      "bookingTime.startTime": bookingTime.startTime,
      "bookingTime.endTime": bookingTime.endTime,
    });

    if (existingBooking) {
      return res.status(400).json({ error: "Time slot unavailable" });
    }

    const newBooking = new Booking({
      businessId,
      serviceId,
      size,
      condition,
      bookingTime,
      status: "pending",  // Default to pending
      customerEmail
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Error creating booking" });
  }
};

// 5. Reschedule Booking
exports.rescheduleBooking = async (req, res) => {
  const { bookingId, newTime } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.time = newTime;
    await booking.save();

    res.status(200).json({ message: 'Booking rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(500).json({ error: 'Error rescheduling booking' });
  }
};

// 6. Cancel Booking
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

// 7. Get Services
exports.getServices = async (req, res) => {
  const businessId = req.user.businessId;  // Assuming the businessId is stored in the JWT token

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.status(200).json({ services: business.services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services' });
  }
};


// 8. Add Service
exports.addService = async (req, res) => {
  const { businessId } = req.user;  // Ensure this contains businessId
  const { serviceName, price, duration } = req.body;
  console.log("Business ID from token:", businessId);

  try {
    const business = await Business.findById(businessId);  // Find the business by ID
    if (!business) return res.status(404).json({ error: 'Business not found' });

    business.services.push({ serviceName, price, duration });
    await business.save();

    res.status(201).json({ message: 'Service added successfully', service: { serviceName, price, duration } });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Error adding service' });
  }
};



// 9. Update Service
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

// 10. Delete Service
exports.deleteService = async (req, res) => {
  const { businessId, serviceId } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const service = business.services.id(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    business.services.pull(serviceId);
    await business.save();

    res.status(200).json({ message: 'Service deleted successfully', services: business.services });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Error deleting service' });
  }
};

// 11. Add Availability
exports.addAvailability = async (req, res) => {
  const { day, startTime, endTime } = req.body;
  const businessId = req.user.businessId;  // Extract businessId from the authenticated user (assuming it's stored in JWT)

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Add new availability slot
    business.availability.push({ day, startTime, endTime });
    await business.save();

    res.status(201).json({ message: 'Availability added successfully', availability: business.availability });
  } catch (error) {
    console.error('Error adding availability:', error);
    res.status(500).json({ error: 'Error adding availability' });
  }
};


// 12. Get Availability
exports.getAvailability = async (req, res) => {
  const businessId = req.user.businessId;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    res.status(200).json(business.availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Error fetching availability' });
  }
};

// 13. Update Availability
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

// 14. Delete Availability
exports.deleteAvailability = async (req, res) => {
  const { businessId, availabilityId } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const availability = business.availability.id(availabilityId);
    if (!availability) return res.status(404).json({ error: 'Availability not found' });

    business.availability.pull(availabilityId);
    await business.save();

    res.status(200).json({ message: 'Availability deleted successfully', availability: business.availability });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Error deleting availability' });
  }
};

// 15. Get Settings
exports.getSettings = async (req, res) => {
  const businessId = req.user.businessId;

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    res.status(200).json(business.settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Error fetching settings' });
  }
};

// 16 Approve Booking
exports.approveBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'approved';
    await booking.save();
    res.status(200).json({ message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error approving booking' });
  }
};

// 17 Decline Booking
exports.declineBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking declined successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error declining booking' });
  }
};

