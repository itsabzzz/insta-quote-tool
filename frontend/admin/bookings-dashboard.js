document.addEventListener('DOMContentLoaded', () => {
    const businessId = localStorage.getItem('business_id');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');

    searchInput.addEventListener('input', loadBookings);
    filterSelect.addEventListener('change', loadBookings);

    function loadBookings() {
        const searchQuery = searchInput.value;
        const filter = filterSelect.value;
        
        fetch(`https://insta-quote-tool-production.up.railway.app/api/bookings?businessId=${businessId}&search=${searchQuery}&filter=${filter}`)
            .then(response => response.json())
            .then(data => {
                const table = document.getElementById('bookings-table');
                table.innerHTML = '';
                data.forEach(booking => {
                    const row = table.insertRow();
                    row.insertCell(0).textContent = booking.size;
                    row.insertCell(1).textContent = booking.condition;
                    row.insertCell(2).textContent = booking.time;
                    row.insertCell(3).textContent = booking.customer_email;
                    row.insertCell(4).innerHTML = `<button onclick="cancelBooking(${booking.id})">Cancel</button>`;
                });
            })
            .catch(error => console.error('Error loading bookings:', error));
    }

    function cancelBooking(id) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            fetch(`https://insta-quote-tool-production.up.railway.app/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: id })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadBookings();
            });
        }
    }

    loadBookings();
});
