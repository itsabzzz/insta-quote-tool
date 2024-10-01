(function() {
  // Create the button to open the modal
  var openBtn = document.createElement('button');
  openBtn.innerText = 'Get an Instant Quote';
  
  // Center the button on the screen
  openBtn.style.position = 'fixed';
  openBtn.style.top = '50%'; // Vertically center the button
  openBtn.style.left = '50%'; // Horizontally center the button
  openBtn.style.transform = 'translate(-50%, -50%)'; // Adjust position to make it exactly center
  openBtn.style.padding = '10px 20px';
  openBtn.style.backgroundColor = '#007bff';
  openBtn.style.color = '#fff';
  openBtn.style.border = 'none';
  openBtn.style.cursor = 'pointer';
  openBtn.style.zIndex = '1000';
  
  // Append the button to the body
  document.body.appendChild(openBtn);

  // Create the overlay (grays out the page)
  var overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'none'; // Hidden initially
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
  modal.style.display = 'none'; // Hidden initially

  // Append modal to body
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

  // Form content (Dropdown for Car Size and Condition)
  var form = document.createElement('form');
  
  // Car size dropdown
  var labelSize = document.createElement('label');
  labelSize.innerText = 'Select Car Size:';
  var selectSize = document.createElement('select');
  selectSize.style.display = 'block';
  selectSize.style.marginTop = '10px';

  var sizes = ['Small', 'Medium', 'Large'];
  sizes.forEach(function(size) {
    var option = document.createElement('option');
    option.value = size.toLowerCase();
    option.text = size;
    selectSize.appendChild(option);
  });

  var labelCondition = document.createElement('label');
  labelCondition.innerText = 'Select Condition:';
  var selectCondition = document.createElement('select');
  selectCondition.style.display = 'block';
  selectCondition.style.marginTop = '10px';

  var conditions = ['Clean', 'Moderate', 'Dirty'];
  conditions.forEach(function(condition) {
    var option = document.createElement('option');
    option.value = condition.toLowerCase();
    option.text = condition;
    selectCondition.appendChild(option);
  });

  form.appendChild(labelSize);
  form.appendChild(selectSize);
  form.appendChild(labelCondition);
  form.appendChild(selectCondition);

  // Submit button
  var submitBtn = document.createElement('button');
  submitBtn.innerText = 'Get Quote';
  submitBtn.style.marginTop = '20px';

  submitBtn.onclick = function(e) {
    e.preventDefault();

    // Simulate fetching the quote
    var size = selectSize.value;
    var condition = selectCondition.value;
    
    // Simulated quote logic (you can replace with real backend call)
    var price = 0;
    if (size === 'small') price = 20;
    if (size === 'medium') price = 40;
    if (size === 'large') price = 60;
    
    if (condition === 'dirty') price += 15;
    if (condition === 'very-dirty') price += 30;

    // Show final quote inside the modal
    modal.innerHTML = `<h2>Your Quote</h2><p>Your estimated quote is: $${price}</p>`;
    var closeQuoteBtn = document.createElement('button');
    closeQuoteBtn.innerText = 'Close';
    closeQuoteBtn.onclick = function() {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };
    modal.appendChild(closeQuoteBtn);
  };

  form.appendChild(submitBtn);
  modal.appendChild(form);
})();

