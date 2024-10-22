import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/business-dashboard/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setSettings(response.data);  // Set settings if successfully retrieved
      } catch (err) {
        setError('Error fetching settings: ' + (err.response?.data?.error || 'Unknown error'));
      }
    };

    fetchSettings();
  }, []);

  return (
    <div>
      <h2>Settings</h2>
      {error && <p>{error}</p>}
      {settings ? (
        <div>{/* Render settings data here */}</div>
      ) : (
        <p>No settings available</p>
      )}
    </div>
  );
};

export default Settings;
