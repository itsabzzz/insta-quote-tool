(function() {
  // Create the button to open the modal
  var openBtn = document.createElement('button');
  openBtn.innerText = 'Get an Instant Quote';
  openBtn.style.marginLeft = '10px';
  openBtn.style.padding = '10px 20px';
  openBtn.style.backgroundColor = '#007bff';
  openBtn.style.color = '#fff';
  openBtn.style.border = 'none';
  openBtn.style.cursor = 'pointer';

  // Append the button next to the paragraph
  var paragraph = document.querySelector('p');
  paragraph.appendChild(openBtn);

  // Create the overlay
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'none';
  overlay.style.zIndex = '999';
  document.body.appendChild(overlay);

  // Create the modal
  var modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.width = '90%';
  modal.style.maxWidth = '500px';
  modal.style.backgroundColor = '#fff';
  modal.style.padding = '20px';
  modal.style.borderRadius = '10px';
  modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  modal.style.zIndex = '1001';
  modal.style.display = 'none';
  document.body.appendChild(modal);

  // Create close button for the modal
  var closeBtn = document.createElement('button');
  closeBtn.innerText = 'Close';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  modal.appendChild(closeBtn);

  // Close modal and overlay on button click
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  };

  // Handle modal opening
  openBtn.onclick = function() {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    showScreenOne();
  };

  // Screen One: Car Size and Condition
  function showScreenOne() {
    modal.innerHTML = '';
    modal.appendChild(closeBtn);

    var form = document.createElement('form');

    // Car size dropdown
    var labelSize = document.createElement('label');
    labelSize.innerText = 'Select Car Size:';
    var selectSize = document.createElement('select');
    selectSize.style.display = 'block';
    selectSize.style.marginTop = '10px';
    ['Small', 'Medium', 'Large'].forEach(function(size) {
      var option = document.createElement('option');
      option.value = size.toLowerCase();
      option.text = size;
      selectSize.appendChild(option);
    });

    // Car condition dropdown
    var labelCondition = document.createElement('label');
    labelCondition.innerText = 'Select Condition:';
    var selectCondition = document.createElement('select');
    selectCondition.style.display = 'block';
    selectCondition.style.marginTop = '10px';
    ['Clean', 'Moderate', 'Dirty'].forEach(function(condition) {
      var option = document.createElement('option');
      option.value = condition.toLowerCase();
      option.text = condition;
      selectCondition.appendChild(option);
    });

    form.appendChild(labelSize);
    form.appendChild(selectSize);
    form.appendChild(labelCondition);
    form.appendChild(selectCondition);

    // Next button
    var nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    nextBtn.style.marginTop = '20px';
    nextBtn.onclick = function(e) {
      e.preventDefault();
      if (selectSize.value && selectCondition.value) {
        showScreenTwo(selectSize.value, selectCondition.value);
      } else {
        alert('Please select all fields.');
      }
    };

    form.appendChild(nextBtn);
    modal.appendChild(form);
  }

  // Screen Two: Booking Date and Address
  function showScreenTwo(size, condition) {
    modal.innerHTML = '';
    modal.appendChild(closeBtn);

    var form = document.createElement('form');

    // Booking date input
    var labelDate = document.createElement('label');
    labelDate.innerText = 'Select Booking Date and Time:';
    var inputDate = document.createElement('input');
    inputDate.type = 'datetime-local';
    inputDate.style.display = 'block';
    inputDate.style.marginTop = '10px';

    // Customer address input with postcode auto-complete
    var labelAddress = document.createElement('label');
    labelAddress.innerText = 'Enter Your Address:';
    var inputAddress = document.createElement('input');
    inputAddress.type = 'text';
    inputAddress.style.display = 'block';
    inputAddress.style.marginTop = '10px';
    inputAddress.placeholder = 'Enter your postcode...';

    // Assuming we have a function to handle address auto-complete
    inputAddress.oninput = function() {
      // Placeholder for address lookup functionality
      console.log('Auto-complete suggestions for:', inputAddress.value);
    };

    form.appendChild(labelDate);
    form.appendChild(inputDate);
    form.appendChild(labelAddress);
    form.appendChild(inputAddress);

    // Next button
    var nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    nextBtn.style.marginTop = '20px';
    nextBtn.onclick = function(e) {
      e.preventDefault();
      if (inputDate.value && inputAddress.value) {
        showScreenThree(size, condition, inputDate.value, inputAddress.value);
      } else {
        alert('Please fill in all fields.');
      }
    };

    form.appendChild(nextBtn);
    modal.appendChild(form);
  }

  // Screen Three: Quote Result and Booking
  function showScreenThree(size, condition, dateTime, address) {
    modal.innerHTML = '';
    modal.appendChild(closeBtn);

    // Send data to the backend to calculate the quote
    fetch('https://insta-quote-tool-production.up.railway.app/get-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ size: size, condition: condition })
    })
    .then(response => response.json())
    .then(data => {
      // Show the fetched quote
      var quoteContainer = document.createElement('div');
      quoteContainer.innerHTML = `<h2>Your Quote</h2><p>Your estimated quote is: $${data.price}</p><p>Selected Date and Time: ${dateTime}</p>`;
      modal.appendChild(quoteContainer);

      // Continue to booking button
      var continueBtn = document.createElement('button');
      continueBtn.innerText = 'Continue to Booking';
      continueBtn.style.marginTop = '20px';
      continueBtn.onclick = function() {
        showBookingScreen(size, condition, dateTime, address, data.price);
      };

      modal.appendChild(continueBtn);
    })
    .catch(error => console.error('Error:', error));
  }

  // Booking Screen: Enter Email and Confirm Booking
  function showBookingScreen(size, condition, dateTime, address, price) {
    modal.innerHTML = '';
    modal.appendChild(closeBtn);

    var form = document.createElement('form');

    // Email input
    var labelEmail = document.createElement('label');
    labelEmail.innerText = 'Enter Your Email:';
    var inputEmail = document.createElement('input');
    inputEmail.type = 'email';
    inputEmail.style.display = 'block';
    inputEmail.style.marginTop = '10px';

    form.appendChild(labelEmail);
    form.appendChild(inputEmail);

    // Book now button
    var bookNowBtn = document.createElement('button');
    bookNowBtn.innerText = 'Book Now';
    bookNowBtn.style.marginTop = '20px';
    bookNowBtn.onclick = function(e) {
      e.preventDefault();
      const email = inputEmail.value;
      if (!email) {
        alert('Please enter your email.');
        return;
      }

      // Submit the booking with email
      fetch('https://insta-quote-tool-production.up.railway.app/submit-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size, condition, dateTime, address, email })
      })
      .then(response => response.json())
      .then(data => {
        modal.innerHTML = `<h2>Booking Confirmation</h2><p>${data.message}</p>`;
      })
      .catch(error => console.error('Error submitting booking:', error));
    };

    form.appendChild(bookNowBtn);
    modal.appendChild(form);
  }
})();
