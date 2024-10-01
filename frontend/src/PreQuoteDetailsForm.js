import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Change from useHistory to useNavigate

function PreQuoteDetailsForm() {
  const [carDetails, setCarDetails] = useState({ size: '', condition: '' });
  const [quote, setQuote] = useState(null);
  const navigate = useNavigate(); // Change to useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form...', carDetails);
      const response = await fetch('http://localhost:5000/get-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carDetails),
      });
  
      // Log the response status and content
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data); // Log the API response
  
      if (data && data.price) {
        setQuote(data.price);
        console.log('Navigating to /quote with price:', data.price);
        navigate('/quote', { state: { price: data.price } });
      } else {
        console.error('No price available in API response');
      }
    } catch (error) {
      console.error('Error fetching the quote:', error);
    }
  };
  
  
  
  
  //input boxes
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Car Size:
          <select value={carDetails.size} onChange={(e) => setCarDetails({ ...carDetails, size: e.target.value })}>
            <option value="">Select Car Size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
        <label>
          Condition:
          <select value={carDetails.condition} onChange={(e) => setCarDetails({ ...carDetails, condition: e.target.value })}>
            <option value="">Select Condition</option>
            <option value="clean">Clean</option>
            <option value="dirty">Dirty</option>
            <option value="very dirty">Very Dirty</option>
          </select>
        </label>
        <button type="submit">Get Quote</button>
      </form>
      {quote && <p>Your estimated quote is: ${quote}</p>} {/* Display the quote */}
    </div>
  );
  
}

export default PreQuoteDetailsForm;
