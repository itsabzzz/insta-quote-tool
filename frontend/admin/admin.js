document.getElementById('login-btn').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email === 'owner@business.com' && password === 'password123') {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadBookings();
  } else {
    alert('Invalid login');
  }
});

// Load bookings from the backend
function loadBookings() {
  fetch('https://insta-quote-tool-production.up.railway.app/api/bookings')
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

// Handle availability form submission
document.getElementById('availability-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  
  fetch('https://insta-quote-tool-production.up.railway.app/update-availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time })
  })
  .then(response => response.json())
  .then(data => alert(data.message))
  .catch(error => console.error('Error updating availability:', error));
});

// Handle pricing form submission
document.getElementById('pricing-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const smallPrice = document.getElementById('small-price').value;
  const mediumPrice = document.getElementById('medium-price').value;
  const largePrice = document.getElementById('large-price').value;

  fetch('https://insta-quote-tool-production.up.railway.app/api/update-pricing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ smallPrice, mediumPrice, largePrice })
  })
  .then(response => response.json())
  .then(data => alert(data.message))
  .catch(error => console.error('Error updating pricing:', error));
});
