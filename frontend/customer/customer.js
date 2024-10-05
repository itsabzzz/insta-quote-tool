// Handle Reschedule Form Submission
document.querySelector('#reschedule-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
  
    const newDate = document.getElementById('new-date').value;
    const newTime = document.getElementById('new-time').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/api/reschedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newDate, newTime })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('message').innerText = data.message;
    })
    .catch(error => console.error('Error:', error));
  });
  
  // Handle Cancel Form Submission
  document.querySelector('#cancel-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
  
    const reason = document.getElementById('reason').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/api/cancel-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('message').innerText = data.message;
    })
    .catch(error => console.error('Error:', error));
  });
  