document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // For now, just hardcode an example email and password
    const validEmail = 'owner@example.com';
    const validPassword = 'password123';
  
    if (email === validEmail && password === validPassword) {
      // Show dashboard and hide login form
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
    } else {
      alert('Invalid login');
    }
  });
  
  
  // Function to load bookings from backend
  function loadBookings() {
    fetch('https://insta-quote-tool-production.up.railway.app/get-bookings')
      .then(response => response.json())
      .then(data => {
        const bookingsTable = document.getElementById('bookings-table');
        bookingsTable.innerHTML = '';
        data.bookings.forEach(booking => {
          bookingsTable.innerHTML += `
            <tr>
              <td>${booking.size}</td>
              <td>${booking.condition}</td>
              <td>${booking.time}</td>
            </tr>`;
        });
      })
      .catch(error => console.error('Error fetching bookings:', error));
  }
  
// Prevent form refresh when updating availability
document.getElementById('availability-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload
  
    // Get values from input fields
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
  
    if (!date || !time) {
      alert('Please select both date and time.');
      return;
    }
  
    // Simulate saving the availability (in the future, this will be sent to the backend)
    console.log(`Availability Updated - Date: ${date}, Time: ${time}`);
  
    alert('Availability updated successfully!');
  });
  
  
  // Function to handle pricing updates
// Prevent form refresh when updating pricing
document.getElementById('pricing-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload
  
    // Get values from input fields
    const smallPrice = document.getElementById('small-price').value;
    const mediumPrice = document.getElementById('medium-price').value;
    const largePrice = document.getElementById('large-price').value;
  
    if (!smallPrice || !mediumPrice || !largePrice) {
      alert('Please enter prices for all car sizes.');
      return;
    }
  
    // Simulate saving the pricing (in the future, this will be sent to the backend)
    console.log(`Pricing Updated - Small: $${smallPrice}, Medium: $${mediumPrice}, Large: $${largePrice}`);
  
    alert('Pricing updated successfully!');
  });
  
  