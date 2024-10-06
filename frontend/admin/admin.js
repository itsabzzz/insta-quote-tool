document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('https://insta-quote-tool-production.up.railway.app/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => {
    console.log('Response status:', response.status);
    
    if (response.status === 401) {
      throw new Error('Invalid login');
    } else if (response.status !== 200) {
      throw new Error('Unexpected response status: ' + response.status);
    }

    return response.json();
  })
  .then(data => {
    console.log('Login data received:', data);
    
    if (data.business_id) {
      console.log('Successful login for business ID:', data.business_id);
      localStorage.setItem('business_id', data.business_id);  // Store business_id for future requests
      window.location.href = 'admin-dashboard.html'; // Redirect to dashboard
    } else {
      throw new Error('Unexpected login response format');
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    alert(error.message);  // Only show the invalid login message on actual errors
  });
});



// Load bookings from the backend for a specific business
function loadBookings() {
  const businessId = localStorage.getItem('business_id');  // Retrieve the stored business_id
  fetch(`https://insta-quote-tool-production.up.railway.app/api/bookings?businessId=${businessId}`)
    .then(response => response.json())
    .then(data => {
      const bookingsTable = document.getElementById('bookings-table');
      bookingsTable.innerHTML = ''; // Clear previous bookings
      data.forEach(booking => {
        const row = bookingsTable.insertRow();
        row.insertCell(0).textContent = booking.size;
        row.insertCell(1).textContent = booking.condition;
        row.insertCell(2).textContent = booking.time;
      });
    })
    .catch(error => console.error('Error fetching bookings:', error));
}

// Handle availability form submission for a specific business
document.getElementById('availability-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const businessId = localStorage.getItem('business_id');  // Retrieve business ID
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  
  fetch('https://insta-quote-tool-production.up.railway.app/update-availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time, businessId })  // Send businessId
  })
  .then(response => response.json())
  .then(data => alert(data.message))
  .catch(error => console.error('Error updating availability:', error));
});

// Handle pricing form submission for a specific business
document.getElementById('pricing-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const businessId = localStorage.getItem('business_id');  // Retrieve business ID
  const smallPrice = document.getElementById('small-price').value;
  const mediumPrice = document.getElementById('medium-price').value;
  const largePrice = document.getElementById('large-price').value;

  fetch('https://insta-quote-tool-production.up.railway.app/api/update-pricing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ smallPrice, mediumPrice, largePrice, businessId })  // Send businessId
  })
  .then(response => response.json())
  .then(data => alert(data.message))
  .catch(error => console.error('Error updating pricing:', error));
});
