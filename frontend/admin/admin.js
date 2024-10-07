document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const businessSettingsForm = document.getElementById('business-settings-form');
  const pricingForm = document.getElementById('pricing-form');
  const availabilityForm = document.getElementById('availability-form');

  // Ensure the login form exists and handles login
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      fetch('https://insta-quote-tool-production.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        if (!response.ok) throw new Error('Invalid email or password');
        return response.json();
      })
      .then(data => {
        localStorage.setItem('business_id', data.business_id);
        window.location.href = 'admin-dashboard.html';
      })
      .catch(error => {
        console.error('Login error:', error);
        alert(error.message);
      });
    });
  }

  // Event listener for business settings form
  if (businessSettingsForm) {
    businessSettingsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const businessId = localStorage.getItem('business_id');
      const businessName = document.getElementById('business-name').value;
      const serviceNames = document.getElementById('service-names').value.split(',');

      if (!businessName || !serviceNames || !businessId) {
        alert('Please fill in all fields.');
        return;
      }

      fetch('https://insta-quote-tool-production.up.railway.app/api/update-business-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, businessName, serviceNames })
      })
      .then(response => {
        if (!response.ok) throw new Error('Error updating business settings');
        return response.json();
      })
      .then(data => alert(data.message))
      .catch(error => console.error('Error updating business settings:', error));
    });
  }

  // Event listener for availability form
  if (availabilityForm) {
    availabilityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const businessId = localStorage.getItem('business_id');
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;

      if (!businessId || !date || !time) {
        alert('Please fill in all fields.');
        return;
      }

      fetch('https://insta-quote-tool-production.up.railway.app/update-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, businessId })
      })
      .then(response => {
        if (!response.ok) throw new Error('Error updating availability');
        return response.json();
      })
      .then(data => alert(data.message))
      .catch(error => console.error('Error updating availability:', error));
    });
  }

  // Event listener for pricing form
  if (pricingForm) {
    pricingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const businessId = localStorage.getItem('business_id');
      const smallPrice = document.getElementById('small-price').value;
      const mediumPrice = document.getElementById('medium-price').value;
      const largePrice = document.getElementById('large-price').value;

      if (!smallPrice || !mediumPrice || !largePrice || !businessId) {
        alert('Please fill in all fields.');
        return;
      }

      fetch('https://insta-quote-tool-production.up.railway.app/api/update-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smallPrice, mediumPrice, largePrice, businessId })
      })
      .then(response => {
        if (!response.ok) throw new Error('Error updating pricing');
        return response.json();
      })
      .then(data => alert(data.message))
      .catch(error => console.error('Error updating pricing:', error));
    });
  }

  // Load bookings
  loadBookings();
});

// Load bookings from the backend for a specific business
function loadBookings() {
  const businessId = localStorage.getItem('business_id');
  if (!businessId) {
    console.log('No business ID found in local storage.');
    return;
  }

  fetch(`https://insta-quote-tool-production.up.railway.app/api/bookings?businessId=${businessId}`)
    .then(response => {
      if (!response.ok) throw new Error('Error fetching bookings');
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      
      const bookingsTable = document.getElementById('bookings-table');
      bookingsTable.innerHTML = ''; // Clear previous bookings

      data.forEach(booking => {
        const row = bookingsTable.insertRow();
        row.insertCell(0).textContent = booking.size;
        row.insertCell(1).textContent = booking.condition;
        row.insertCell(2).textContent = booking.time;

        // Add Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        cancelBtn.onclick = () => handleCancel(booking.id);
        row.insertCell(3).appendChild(cancelBtn);

        // Add Reschedule button
        const rescheduleBtn = document.createElement('button');
        rescheduleBtn.innerText = 'Reschedule';
        rescheduleBtn.onclick = () => handleReschedule(booking.id);
        row.insertCell(4).appendChild(rescheduleBtn);
      });
    })
    .catch(error => console.error('Error fetching bookings:', error));
}

// Cancel booking
function handleCancel(bookingId) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    fetch('https://insta-quote-tool-production.up.railway.app/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    })
    .then(response => {
      if (!response.ok) throw new Error('Error canceling booking');
      return response.json();
    })
    .then(data => {
      alert(data.message);
      loadBookings();
    })
    .catch(error => console.error('Error canceling booking:', error));
  }
}

// Reschedule booking
function handleReschedule(bookingId) {
  const newTime = prompt('Enter new time for the booking (e.g., 2024-10-15 14:00)');
  if (newTime) {
    fetch('https://insta-quote-tool-production.up.railway.app/reschedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, newTime })
    })
    .then(response => {
      if (!response.ok) throw new Error('Error rescheduling booking');
      return response.json();
    })
    .then(data => {
      alert(data.message);
      loadBookings();
    })
    .catch(error => console.error('Error rescheduling booking:', error));
  }
}
