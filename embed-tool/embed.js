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
  modal.style.width = '400px';
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
  };

  // Form content (Car Size, Condition, and Calendar for Booking)
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

  form.appendChild(labelSize);
  form.appendChild(selectSize);
  form.appendChild(labelCondition);
  form.appendChild(selectCondition);
  form.appendChild(labelTime);
  form.appendChild(selectTime);

  // Submit button
  var submitBtn = document.createElement('button');
  submitBtn.innerText = 'Get Quote';
  submitBtn.style.marginTop = '20px';

  submitBtn.onclick = function(e) {
    e.preventDefault();

    var size = selectSize.value;
    var condition = selectCondition.value;
    var time = selectTime.value;

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
      // Show the fetched quote and selected time slot
      console.log('Response from backend:', data); // Add this line to debug
      modal.innerHTML = `<h2>Your Quote</h2><p>Your estimated quote is: $${data.price}</p><p>Selected time slot: ${time}</p>`;
      var closeQuoteBtn = document.createElement('button');
      closeQuoteBtn.innerText = 'Close';
      closeQuoteBtn.onclick = function() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
      };
      modal.appendChild(closeQuoteBtn);
    })
    .catch(error => console.error('Error:', error));
};

  form.appendChild(submitBtn);
  modal.appendChild(form);
})();
