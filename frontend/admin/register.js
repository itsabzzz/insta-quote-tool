document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('https://insta-quote-tool-production.up.railway.app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Registration error:', error));
  });
  