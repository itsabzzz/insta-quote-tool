import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ serviceName: '', price: '', duration: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/services`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setServices(response.data.services);
      } catch (err) {
        setError('Error fetching services: ' + (err.response?.data?.error || 'Unknown error'));
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/service/add`, newService, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('Service added successfully');
      setServices([...services, response.data.service]);
      setNewService({ serviceName: '', price: '', duration: '' });  // Reset form
    } catch (err) {
      setError('Error adding service: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>Services</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <ul>
        {services.length > 0 ? (
          services.map((service) => (
            <li key={service._id || service.serviceName}>  {/* Use _id as key, fallback to serviceName */}
              {service.serviceName} - ${service.price} - {service.duration} minutes
            </li>
          ))
        ) : (
          <p>No services available</p>
        )}
      </ul>

      <h3>Add a New Service</h3>
      <form onSubmit={handleAddService}>
        <label>Service Name:</label>
        <input
          type="text"
          value={newService.serviceName}
          onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
          required
        />
        <label>Price:</label>
        <input
          type="number"
          value={newService.price}
          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          required
        />
        <label>Duration (minutes):</label>
        <input
          type="number"
          value={newService.duration}
          onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
          required
        />
        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default Services;


