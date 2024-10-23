import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Attach the token to the request
          },
        });
        setBookings(response.data);  // Set bookings if successfully retrieved
      } catch (err) {
        setError('Error fetching bookings: ' + (err.response?.data?.error || 'Unknown error'));
      }
    };

    fetchBookings();
  }, []);

  // Approve Booking
  const approveBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/booking/approve`, { bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: 'approved' } : booking
        )
      );
    } catch (err) {
      setError('Error approving booking: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  // Decline Booking
  const declineBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/booking/decline`, { bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (err) {
      setError('Error declining booking: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p>{error}</p>}
      <ul>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <li key={booking._id}>
              {booking.serviceName} on {booking.bookingTime?.day || 'Unknown Day'} - {booking.status}
              {booking.status === 'pending' && (
                <div>
                  <button onClick={() => approveBooking(booking._id)}>Approve</button>
                  <button onClick={() => declineBooking(booking._id)}>Decline</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No bookings available</p>
        )}
      </ul>
    </div>
  );
};

export default Bookings;

