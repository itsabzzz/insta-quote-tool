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

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p>{error}</p>}
      <ul>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <li key={booking._id}>
              {booking.serviceName} on {booking.bookingTime?.day ? booking.bookingTime.day : 'Unknown Day'}
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
