import React from 'react';

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div style={modalStyles}>
      <div style={overlayStyles} onClick={onClose} />
      <div style={modalContentStyles}>
        {children}
        <button style={closeButtonStyles} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// CSS styles
const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const overlayStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  position: 'relative',
  zIndex: 1001,
};

const closeButtonStyles = {
  background: '#ff0000',
  color: '#fff',
  padding: '10px',
  cursor: 'pointer',
};

export default Modal;
