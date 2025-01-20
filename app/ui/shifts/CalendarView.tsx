import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Shift } from '../../api/shifts'; // Assuming Shift is your shift type

interface CalendarProps {
  shifts: Shift[];
}

const CalendarView: React.FC<CalendarProps> = ({ shifts }) => {
  const [currentView, setCurrentView] = useState('dayGridMonth'); // month view by default

  const handleDateClick = (info: any) => {
    const date = info.dateStr;
    // Filter shifts for that date
    const shiftsOnDate = shifts.filter((shift) => {
      return new Date(shift.date).toLocaleDateString() === date;
    });
    console.log(shiftsOnDate);
    // Handle showing shift details in a modal here
  };

  const renderEvents = () => {
    return shifts.map((shift) => ({
      title: shift.facilityId?.name || 'Shift Event',
      start: shift.startTime,
      end: shift.endTime,
      description: `${shift.facilityId?.name} shift, from ${new Date(shift.startTime).toLocaleTimeString()} to ${new Date(shift.endTime).toLocaleTimeString()}`,
      allDay: false,
      extendedProps: {
        shiftId: shift._id,
        details: shift,
      },
    }));
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        events={renderEvents()}
        dateClick={handleDateClick}
        eventClick={(info) => {
          // Here, open a modal with shift details
          const shiftDetails = info.event.extendedProps.details;
          console.log(shiftDetails);
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
      {/* Include a modal for showing more details when clicking on a shift */}
    </div>
  );
};

export default CalendarView;
