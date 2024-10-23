import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [newAvailability, setNewAvailability] = useState({ day: '', startTime: '', endTime: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/availability`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAvailability(response.data);
      } catch (err) {
        setError('Error fetching availability: ' + (err.response?.data?.error || 'Unknown error'));
      }
    };
    fetchAvailability();
  }, []);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/availability/add`, newAvailability, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('Availability added successfully');
      
      // Update state with the new availability directly
      setAvailability([...availability, response.data.availability[response.data.availability.length - 1]]);
      setNewAvailability({ day: '', startTime: '', endTime: '' });  // Reset form
    } catch (err) {
      setError('Error adding availability: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>Availability</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <ul>
        {availability.length > 0 ? (
          availability.map((slot, index) => (
            <li key={index}>
              {slot.day}: {slot.startTime} - {slot.endTime}
            </li>
          ))
        ) : (
          <p>No availability added yet</p>
        )}
      </ul>

      <h3>Add New Availability</h3>
      <form onSubmit={handleAddAvailability}>
        <label>Day:</label>
        <input
          type="text"
          value={newAvailability.day}
          onChange={(e) => setNewAvailability({ ...newAvailability, day: e.target.value })}
          required
        />
        <label>Start Time:</label>
        <input
          type="time"
          value={newAvailability.startTime}
          onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
          required
        />
        <label>End Time:</label>
        <input
          type="time"
          value={newAvailability.endTime}
          onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
          required
        />
        <button type="submit">Add Availability</button>
      </form>
    </div>
  );
};

export default Availability;
