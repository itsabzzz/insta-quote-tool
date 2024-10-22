import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      const token = localStorage.getItem('token');  // Retrieve the JWT token

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/availability`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Attach the token to the request
          },
        });
        setAvailability(response.data);  // Set availability if successfully retrieved
      } catch (err) {
        setError('Error fetching availability: ' + (err.response?.data?.error || 'Unknown error'));
      }
    };

    fetchAvailability();
  }, []);

  return (
    <div>
      <h2>Availability</h2>
      {error && <p>{error}</p>}
      <ul>
        {availability.length > 0 ? (
          availability.map((slot) => (
            <li key={slot._id}>
              {slot.day}: {slot.startTime} - {slot.endTime}
            </li>
          ))
        ) : (
          <p>No availability slots</p>
        )}
      </ul>
    </div>
  );
};

export default Availability;
