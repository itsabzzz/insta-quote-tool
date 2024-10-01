import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function BookingConfirmation() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h2>Select a Booking Date</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
      />
      <p>Selected Date: {selectedDate.toDateString()}</p>
      {/* Add the booking logic or submit button here */}
    </div>
  );
}

export default BookingConfirmation;
