document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.business_id) {
        localStorage.setItem('business_id', data.business_id);
        window.location.href = 'admin-dashboard.html';
      }
    })
    .catch(error => console.error('Login error:', error));
  });
  