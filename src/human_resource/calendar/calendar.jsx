import React, { useState, useEffect } from 'react';
import './calendar.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function CalendarApp() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [reminder, setReminder] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = Array(firstDayOfWeek).fill(null);
  const daysArray = Array(daysInMonth).fill(0).map((_, i) => i + 1);
  const calendarDays = [...blanks, ...daysArray];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetch(`https://software.iqjita.com/hr/calendar_api.php?action=get`)
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(e => {
          if (!grouped[e.date]) grouped[e.date] = [];
          grouped[e.date].push(e);
        });
        setEvents(grouped);
      });
  }, [currentMonth, currentYear]);

  const openAddEventModal = (day) => {
    if (!day) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setEventTitle('');
    setReminder(false);
    setShowModal(true);
  };

  const saveEvent = async () => {
    if (!eventTitle.trim()) return alert("Event title cannot be empty");

    const res = await fetch('https://software.iqjita.com/hr/calendar_api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        date: selectedDate,
        title: eventTitle.trim(),
        reminder: reminder ? 1 : 0,
      })
    });
    const newEvent = await res.json();

    setEvents(prev => {
      const prevEvents = prev[selectedDate] || [];
      return {
        ...prev,
        [selectedDate]: [...prevEvents, newEvent]
      };
    });
    setShowModal(false);
  };

  const deleteEvent = async (id, date) => {
    await fetch(`https://software.iqjita.com/hr/calendar_api.php?action=delete&id=${id}`);
    setEvents(prev => ({
      ...prev,
      [date]: prev[date].filter(ev => ev.id !== id)
    }));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        {/* <button onClick={() => setCurrentYear(y => y - 1)}>{'<<'}</button> */}
        <button onClick={() => setCurrentMonth(m => m === 0 ? (setCurrentYear(y => y - 1), 11) : m - 1)}>Prev</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={() => setCurrentMonth(m => m === 11 ? (setCurrentYear(y => y + 1), 0) : m + 1)}>Next</button>
        {/* <button onClick={() => setCurrentYear(y => y + 1)}>{'>>'}</button> */}
      </div>

      <div className="calendar-days-of-week">
        {daysOfWeek.map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, idx) => {
          const dateStr = day
            ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null;
          const dayEvents = dateStr && events[dateStr] ? events[dateStr] : [];

          return (
            <div
              key={idx}
              className={`calendar-day ${day ? '' : 'blank'} ${dateStr === new Date().toISOString().slice(0, 10) ? 'today' : ''}`}
              onClick={() => openAddEventModal(day)}
              title={dayEvents.map(e => e.title).join('\n')}
            >
              <div>{day}</div>
              <div className="event-dots">
                {dayEvents.map((e, i) => (
                  <span key={i} className="dot" title={e.title}></span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="hr-cale" onClick={e => e.stopPropagation()}>
      <h3>Add Event on {selectedDate}</h3>
      <input
        type="text"
        placeholder="Event title"
        value={eventTitle}
        onChange={e => setEventTitle(e.target.value)}
      />
<div className='reminder'>
  <label className="reminder-label">Set Reminder</label>
  <input
    type="checkbox"
    checked={reminder}
    onChange={e => setReminder(e.target.checked)}
  />
</div>


      <div className="modal-buttons">
        <button onClick={() => setShowModal(false)}>Cancel</button>
        <button onClick={saveEvent}>Save</button>
      </div>
      <ul>
        {(events[selectedDate] || []).map(ev => (
          <li key={ev.id}>
            {ev.title} {ev.reminder === "1" && "🔔"}
            <button onClick={() => deleteEvent(ev.id, selectedDate)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

    </div>
  );
}

export default CalendarApp;
