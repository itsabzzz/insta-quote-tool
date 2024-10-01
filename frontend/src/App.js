import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react'; // Importing useState for modal control
import HomePage from './HomePage';
import PreQuoteDetailsForm from './PreQuoteDetailsForm'; // Your existing form
import QuotePage from './QuotePage';
import BookingConfirmation from './BookingConfirmation';
import Modal from './components/Modal'; // Import Modal component


function App() {
  // State to handle the visibility of the modal
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <Router>
      <div>
        {/* This button will trigger the modal */}
        <button
          onClick={openModal}
          style={{
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Get Instant Quote
        </button>

        {/* Render the modal if the state is true */}
        <Modal isVisible={isModalVisible} onClose={closeModal}>
          {/* The quote form inside the modal */}
          <PreQuoteDetailsForm />
        </Modal>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-details" element={<PreQuoteDetailsForm />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/booking" element={<BookingConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

