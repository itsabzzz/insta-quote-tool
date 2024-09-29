(function() {
    // Create the popup container
    var popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '10px';
    popup.style.right = '10px';
    popup.style.width = '300px';
    popup.style.height = '300px';
    popup.style.backgroundColor = '#fff';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';
    popup.style.fontFamily = 'Arial, sans-serif';
    
    // Add Close button
    var closeBtn = document.createElement('button');
    closeBtn.innerText = 'X';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function () {
      document.body.removeChild(popup);
    };
    popup.appendChild(closeBtn);
  
    // Add dropdown for Car Size
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
  
    // Add dropdown for Car Condition
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
  
    // Get quote button
    var button = document.createElement('button');
    button.innerText = 'Get Quote';
    button.style.display = 'block';
    button.style.marginTop = '20px';
  
    button.onclick = function(e) {
      e.preventDefault();
      fetch('http://localhost:5000/get-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: selectSize.value, condition: selectCondition.value })
      })
      .then(response => response.json())
      .then(data => alert('Your quote is: ' + data.price))
      .catch(error => console.error('Error:', error));
    };
  
    // Append elements to the form
    var form = document.createElement('form');
    form.appendChild(labelSize);
    form.appendChild(selectSize);
    form.appendChild(labelCondition);
    form.appendChild(selectCondition);
    form.appendChild(button);
  
    // Append form to the popup
    popup.appendChild(form);
  
    // Append popup to the body
    document.body.appendChild(popup);
  })();
  
  