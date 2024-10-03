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
  
  // Function to handle availability updates
  document.getElementById('availability-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/update-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, time }),
    })
    .then(response => response.json())
    .then(data => alert('Availability updated!'))
    .catch(error => console.error('Error updating availability:', error));
  });
  
  // Function to handle pricing updates
  document.getElementById('pricing-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const smallPrice = document.getElementById('small-price').value;
    const mediumPrice = document.getElementById('medium-price').value;
    const largePrice = document.getElementById('large-price').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/update-pricing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ smallPrice, mediumPrice, largePrice }),
    })
    .then(response => response.json())
    .then(data => alert('Pricing updated!'))
    .catch(error => console.error('Error updating pricing:', error));
  });
  