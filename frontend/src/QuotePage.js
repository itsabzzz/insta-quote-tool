import { useLocation } from 'react-router-dom';

function QuotePage() {
  const location = useLocation();
  const { price } = location.state || {};

  return (
    <div>
      <h1>Your Quote</h1>
      {price ? <p>The estimated price is ${price}</p> : <p>No quote available</p>}
    </div>
  );
}

export default QuotePage;
