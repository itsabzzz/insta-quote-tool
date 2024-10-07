document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('service-form');
    const serviceName = document.getElementById('service-name');
    const servicePrice = document.getElementById('service-price');
    const servicesList = document.getElementById('services-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const businessId = localStorage.getItem('business_id');
        fetch('https://insta-quote-tool-production.up.railway.app/api/update-pricing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service: serviceName.value,
                price: servicePrice.value,
                businessId: businessId
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadServices();
        })
        .catch(error => console.error('Error updating services:', error));
    });

    function loadServices() {
        const businessId = localStorage.getItem('business_id');
        fetch(`https://insta-quote-tool-production.up.railway.app/api/services?businessId=${businessId}`)
            .then(response => response.json())
            .then(data => {
                servicesList.innerHTML = '';
                data.forEach(service => {
                    const li = document.createElement('li');
                    li.textContent = `${service.name} - $${service.price}`;
                    servicesList.appendChild(li);
                });
            })
            .catch(error => console.error('Error loading services:', error));
    }

    loadServices();
});
