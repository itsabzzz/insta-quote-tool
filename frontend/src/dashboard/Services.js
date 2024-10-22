import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/services`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Attach the token to the request
          },
        });
        setServices(response.data.services);  // Set services if successfully retrieved
      } catch (err) {
        setError('Error fetching services: ' + (err.response?.data?.error || 'Unknown error'));
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <h2>Services</h2>
      {error && <p>{error}</p>}
      <ul>
        {services.length > 0 ? (
          services.map((service) => (
            <li key={service._id}>
              {service.serviceName} - ${service.price}
            </li>
          ))
        ) : (
          <p>No services available</p>
        )}
      </ul>
    </div>
  );
};

export default Services;

