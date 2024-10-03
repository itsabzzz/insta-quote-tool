// Handle login (mock authentication for now)
document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

      // Dummy login credentials
    const dummyEmail = "admin@business.com";
    const dummyPassword = "password123";
  
    // Mock login check (you can replace with real authentication later)
    if (email === 'admin@example.com' && password === 'password') {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      loadDashboardData();
    } else {
      alert('Invalid login');
    }
  });
  
  // Function to load initial data for the dashboard
  function loadDashboardData() {
    // Fetch bookings and display them
    fetch('https://insta-quote-tool-production.up.railway.app/get-bookings')
      .then(response => response.json())
      .then(data => {
        const bookingsTable = document.getElementById('bookings-table');
        bookingsTable.innerHTML = ''; // Clear existing rows
  
        data.bookings.forEach(booking => {
          const row = bookingsTable.insertRow();
          const sizeCell = row.insertCell(0);
          const conditionCell = row.insertCell(1);
          const timeCell = row.insertCell(2);
          sizeCell.innerHTML = booking.size;
          conditionCell.innerHTML = booking.condition;
          timeCell.innerHTML = booking.time;
        });
      })
      .catch(error => console.error('Error fetching bookings:', error));
  
    // Fetch pricing and populate the fields
    fetch('https://insta-quote-tool-production.up.railway.app/get-pricing')
      .then(response => response.json())
      .then(data => {
        document.getElementById('small-price').value = data.small;
        document.getElementById('medium-price').value = data.medium;
        document.getElementById('large-price').value = data.large;
      })
      .catch(error => console.error('Error fetching pricing:', error));
  }
  
  // Handle pricing updates
  document.getElementById('pricing-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload
  
    const smallPrice = document.getElementById('small-price').value;
    const mediumPrice = document.getElementById('medium-price').value;
    const largePrice = document.getElementById('large-price').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/update-pricing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ smallPrice, mediumPrice, largePrice })
    })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(error => console.error('Error updating pricing:', error));
  });
  
  // Handle availability updates
  document.getElementById('availability-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload
  
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/update-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, time })
    })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(error => console.error('Error updating availability:', error));
  });
  