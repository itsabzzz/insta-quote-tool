document.addEventListener('DOMContentLoaded', function () {
  (function () {
    // Extract businessId from the script tag URL
    function getBusinessIdFromScript() {
      const scriptTags = document.getElementsByTagName('script');
      for (let i = 0; i < scriptTags.length; i++) {
        const src = scriptTags[i].src;
        if (src.includes('embed.js')) {
          const urlParams = new URLSearchParams(src.split('?')[1]);
          return urlParams.get('businessId');
        }
      }
      return null;
    }

    const businessId = getBusinessIdFromScript();

    console.log('Business ID:', businessId);  // Log to check if businessId is valid

    // Ensure businessId is provided
    if (!businessId) {
      console.error('Business ID is missing or invalid.');
      return;
    }


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
    modal.style.height = '300px';
    modal.style.overflowY = 'auto';
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
    closeBtn.onclick = function () {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };

    // Handle modal opening
    openBtn.onclick = function () {
      modal.style.display = 'block';
      overlay.style.display = 'block';
      showScreenOne();
    };

    // Screen One: Car Size, Condition, Service, and Booking Date
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
      ['Small', 'Medium', 'Large'].forEach(function (size) {
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
      ['Clean', 'Moderate', 'Dirty'].forEach(function (condition) {
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

      // Fetch services from the backend using the business ID
      fetch(`https://insta-quote-tool-production.up.railway.app/api/business-dashboard/services?businessId=${businessId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error fetching services');
          }
          return response.json();
        })
        .then(data => {
          // Clear previous options and add a placeholder
          selectService.innerHTML = '';
          var defaultOption = document.createElement('option');
          defaultOption.text = 'Select a service';
          defaultOption.disabled = true;
          defaultOption.selected = true;
          selectService.appendChild(defaultOption);

          // Populate the select box with services
          if (data.services && data.services.length > 0) {
            data.services.forEach(service => {
              var option = document.createElement('option');
              option.value = service._id;
              option.text = `${service.serviceName} - $${service.price} (${service.duration} mins)`;
              selectService.appendChild(option);
            });
          } else {
            var noServiceOption = document.createElement('option');
            noServiceOption.text = 'No services available';
            noServiceOption.disabled = true;
            selectService.appendChild(noServiceOption);
          }
        })
        .catch(error => {
          console.error('Error fetching services:', error);
          // Display error in the dropdown if fetching services fails
          selectService.innerHTML = '';
          var errorOption = document.createElement('option');
          errorOption.text = 'Error fetching services';
          errorOption.disabled = true;
          selectService.appendChild(errorOption);
        });

      form.appendChild(labelSize);
      form.appendChild(selectSize);
      form.appendChild(labelCondition);
      form.appendChild(selectCondition);
      form.appendChild(labelService);
      form.appendChild(selectService);

      // Next button
      var nextBtn = document.createElement('button');
      nextBtn.innerText = 'Next';
      nextBtn.style.marginTop = '20px';
      nextBtn.onclick = function (e) {
        e.preventDefault();
        if (selectSize.value && selectCondition.value && selectService.value) {
          showScreenTwo(selectSize.value, selectCondition.value, selectService.value);
        } else {
          alert('Please select all fields.');
        }
      };

      form.appendChild(nextBtn);
      modal.appendChild(form);
    }

    // Screen Two: Booking Date and Address
    function showScreenTwo(size, condition, service) {
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

      // Customer postcode input with auto-complete for address
      var labelAddress = document.createElement('label');
      labelAddress.innerText = 'Enter Your Postcode:';
      var inputPostcode = document.createElement('input');
      inputPostcode.type = 'text';
      inputPostcode.style.display = 'inline-block';
      inputPostcode.style.width = '60%';
      inputPostcode.style.marginTop = '10px';
      inputPostcode.placeholder = 'Start typing your postcode...';

      // Dropdown for address suggestions
      var addressDropdown = document.createElement('select');
      addressDropdown.style.display = 'block';
      addressDropdown.style.marginTop = '10px';
      addressDropdown.style.width = '100%';

      // Customer house number input
      var labelHouseNumber = document.createElement('label');
      labelHouseNumber.innerText = 'Enter House Number/Name:';
      var inputHouseNumber = document.createElement('input');
      inputHouseNumber.type = 'text';
      inputHouseNumber.placeholder = 'House number/name';
      inputHouseNumber.style.display = 'block';
      inputHouseNumber.style.width = '30%';
      inputHouseNumber.style.marginTop = '10px';

      // Fetch address suggestions
      // Fetch address suggestions
      inputPostcode.oninput = function () {
        if (inputPostcode.value.length >= 3) {
          fetch(`https://insta-quote-tool-production.up.railway.app/api/business/places?input=${inputPostcode.value}`)
            .then(response => response.json())
            .then(data => {
              addressDropdown.innerHTML = '';
              data.forEach(prediction => {
                var option = document.createElement('option');
                option.value = prediction.description;
                option.text = prediction.description;
                addressDropdown.appendChild(option);
              });
            })
            .catch(error => console.error('Error fetching address suggestions:', error));
        }
      };


      form.appendChild(labelDate);
      form.appendChild(inputDate);
      form.appendChild(labelAddress);
      form.appendChild(inputPostcode);
      form.appendChild(addressDropdown);
      form.appendChild(labelHouseNumber);
      form.appendChild(inputHouseNumber);

      // Next button
      var nextBtn = document.createElement('button');
      nextBtn.innerText = 'Next';
      nextBtn.style.marginTop = '20px';
      nextBtn.onclick = function (e) {
        e.preventDefault();
        if (inputDate.value && inputHouseNumber.value && addressDropdown.value) {
          var fullAddress = `${inputHouseNumber.value}, ${addressDropdown.value}`;
          showScreenThree(size, condition, service, inputDate.value, fullAddress);
        } else {
          alert('Please fill in all fields.');
        }
      };

      form.appendChild(nextBtn);
      modal.appendChild(form);
    }

    // Screen Three: Quote Result and Booking
function showScreenThree(size, condition, service, dateTime, address) {
  modal.innerHTML = '';
  modal.appendChild(closeBtn);

  // Send data to the backend to calculate the quote
  fetch('https://insta-quote-tool-production.up.railway.app/api/business/get-quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ size, condition, service })
  })
  .then(response => {
    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error('Error fetching quote');
    }
    return response.json();
  })
  .then(data => {
    // Show the fetched quote and customer details
    var quoteContainer = document.createElement('div');
    quoteContainer.innerHTML = `
      <h2>Your Quote</h2>
      <p>Your estimated quote is: $${data.price}</p>
      <p>Details:</p>
      <ul>
        <li>Car Size: ${size}</li>
        <li>Condition: ${condition}</li>
        <li>Service: ${service}</li>
        <li>Booking Date and Time: ${dateTime}</li>
        <li>Address: ${address}</li>
      </ul>`;
    modal.appendChild(quoteContainer);

    // Continue to booking button
    var continueBtn = document.createElement('button');
    continueBtn.innerText = 'Continue to Booking';
    continueBtn.style.marginTop = '20px';
    continueBtn.onclick = function () {
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
      bookNowBtn.onclick = function () {
        const email = inputEmail.value;

        if (!email) {
          alert('Please enter your email.');
          return;
        }

        // Submit the booking with email
        fetch('https://insta-quote-tool-production.up.railway.app/api/business/submit-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ size, condition, service, dateTime, address, email })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error submitting booking');
          }
          return response.json();
        })
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
    closeQuoteBtn.onclick = function () {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };
    modal.appendChild(closeQuoteBtn);
  })
  .catch(error => {
    console.error('Error fetching quote:', error);
    alert('There was an issue calculating the quote. Please try again later.');
  });
}


  })();
});
