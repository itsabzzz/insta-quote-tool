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
  modal.style.maxWidth = '400px';
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
    renderFirstScreen();
  };

  // Form content screens
  function renderFirstScreen() {
    modal.innerHTML = '';
    modal.appendChild(closeBtn);

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

    // Service type dropdown
    var labelService = document.createElement('label');
    labelService.innerText = 'Select Service Type:';
    var selectService = document.createElement('select');
    selectService.style.display = 'block';
    selectService.style.marginTop = '10px';
    ['Basic Wash', 'Full Detailing', 'Ceramic Coating'].forEach(function(service) {
      var option = document.createElement('option');
      option.value = service.toLowerCase();
      option.text = service;
      selectService.appendChild(option);
    });

    var nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    nextBtn.style.marginTop = '20px';

    nextBtn.onclick = function(e) {
      e.preventDefault();
      const size = selectSize.value;
      const condition = selectCondition.value;
      const service = selectService.value;

      if (!size || !condition || !service) {
        alert('Please select all fields.');
        return;
      }
      renderSecondScreen(size, condition, service);
    };

    modal.appendChild(labelSize);
    modal.appendChild(selectSize);
    modal.appendChild(labelCondition);
    modal.appendChild(selectCondition);
    modal.appendChild(labelService);
    modal.appendChild(selectService);
    modal.appendChild(nextBtn);
  }

  function renderSecondScreen(size, condition, service) {
    modal.innerHTML = '';
    modal.appendChild(closeBtn);

    // Date input
    var labelDate = document.createElement('label');
    labelDate.innerText = 'Select Date:';
    var inputDate = document.createElement('input');
    inputDate.type = 'date';
    inputDate.style.display = 'block';
    inputDate.style.marginTop = '10px';
    inputDate.style.width = '100%';

    // Time slot dropdown
    var labelTime = document.createElement('label');
    labelTime.innerText = 'Select Time Slot:';
    var selectTime = document.createElement('select');
    selectTime.style.display = 'block';
    selectTime.style.marginTop = '10px';
    ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'].forEach(function(time) {
      var option = document.createElement('option');
      option.value = time;
      option.text = time;
      selectTime.appendChild(option);
    });

    // Upsell option for same or next day service
    var labelUpsell = document.createElement('label');
    labelUpsell.innerText = 'Would you like same/next day service for an additional fee?';
    var selectUpsell = document.createElement('select');
    selectUpsell.style.display = 'block';
    selectUpsell.style.marginTop = '10px';
    ['No', 'Yes'].forEach(function(optionText) {
      var option = document.createElement('option');
      option.value = optionText.toLowerCase();
      option.text = optionText;
      selectUpsell.appendChild(option);
    });

    var nextBtn = document.createElement('button');
    nextBtn.innerText = 'Get Quote';
    nextBtn.style.marginTop = '20px';

    nextBtn.onclick = function(e) {
      e.preventDefault();
      const date = inputDate.value;
      const time = selectTime.value;
      const upsell = selectUpsell.value;

      if (!date || !time) {
        alert('Please select a date and time slot.');
        return;
      }
      renderQuoteScreen(size, condition, service, date, time, upsell);
    };

    modal.appendChild(labelDate);
    modal.appendChild(inputDate);
    modal.appendChild(labelTime);
    modal.appendChild(selectTime);
    modal.appendChild(labelUpsell);
    modal.appendChild(selectUpsell);
    modal.appendChild(nextBtn);
  }

  function renderQuoteScreen(size, condition, service, date, time, upsell) {
    modal.innerHTML = '';
    modal.appendChild(closeBtn);

    // Send data to the backend to calculate the quote
    fetch('https://insta-quote-tool-production.up.railway.app/get-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ size, condition, service, date, time, upsell })
    })
    .then(response => response.json())
    .then(data => {
      // Show the fetched quote and "Continue to Booking" button
      modal.innerHTML = `<h2>Your Quote</h2><p>Your estimated quote is: $${data.price}</p><p>Selected date: ${date}</p><p>Selected time slot: ${time}</p>`;

      const continueBtn = document.createElement('button');
      continueBtn.innerText = 'Continue to Booking';

      // When clicking "Continue to Booking"
      continueBtn.onclick = function() {
        modal.innerHTML = '';  // Clear the modal content

        // Email intake form
        var labelEmail = document.createElement('label');
        labelEmail.innerText = 'Enter Email:';
        var inputEmail = document.createElement('input');
        inputEmail.type = 'email';
        inputEmail.style.display = 'block';
        inputEmail.style.marginTop = '10px';

        var bookNowBtn = document.createElement('button');
        bookNowBtn.innerText = 'Book Now';
        bookNowBtn.style.marginTop = '20px';

        // Booking submission logic after taking email
        bookNowBtn.onclick = function() {
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
            body: JSON.stringify({ size, condition, service, date, time, email, upsell })
          })
          .then(response => response.json())
          .then(data => {
            modal.innerHTML = `<h2>Booking Confirmation</h2><p>${data.message}</p>`;
          })
          .catch(error => console.error('Error submitting booking:', error));
        };

        modal.appendChild(labelEmail);
        modal.appendChild(inputEmail);
        modal.appendChild(bookNowBtn);
      };

      modal.appendChild(continueBtn);

      const closeQuoteBtn = document.createElement('button');
      closeQuoteBtn.innerText = 'Close';
      closeQuoteBtn.onclick = function() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
      };
      modal.appendChild(closeQuoteBtn);
    })
    .catch(error => console.error('Error:', error));
  }
})();