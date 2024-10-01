import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Car Detailing Quote Tool</h1>
      <Link to="/car-details">
        <button>Get a Quote</button>
      </Link>
    </div>
  );
}

export default HomePage;
