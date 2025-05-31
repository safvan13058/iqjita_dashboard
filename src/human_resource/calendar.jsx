import React, { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState({}); // key: 'YYYY-MM-DD', value: [{title: string}]

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const blanks = Array(firstDayOfWeek).fill(null);
  const daysArray = Array(daysInMonth).fill(0).map((_, i) => i + 1);
  const calendarDays = [...blanks, ...daysArray];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const prevYear = () => setCurrentYear(y => y - 1);
  const nextYear = () => setCurrentYear(y => y + 1);

  const openAddEventModal = (day) => {
    if (!day) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setEventTitle('');
    setShowModal(true);
  };

  const saveEvent = () => {
    if (!eventTitle.trim()) return alert("Event title cannot be empty");

    setEvents(prev => {
      const prevEvents = prev[selectedDate] || [];
      return {
        ...prev,
        [selectedDate]: [...prevEvents, { title: eventTitle.trim() }]
      };
    });
    setShowModal(false);
  };

  const styles = {
    container: {
      maxWidth: '90%',
      margin: '20px auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'var(--hr-background-dark)',
      color: 'var(--hr-text-primary)',
      borderRadius: 'var(--hr-border-radius)',
      padding: 20,
      boxShadow: 'var(--hr-box-shadow-dark)',
      userSelect: 'none',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    button: {
      backgroundColor: 'var(--hr-button-primary-bg)',
      color: 'var(--hr-button-primary-text)',
      border: 'none',
      borderRadius: 'var(--hr-border-radius)',
      padding: '6px 10px',
      cursor: 'pointer',
      transition: 'background-color var(--hr-transition-speed)',
      boxShadow: 'var(--hr-box-shadow-light)',
    },
    daysOfWeek: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      textAlign: 'center',
      fontWeight: 'bold',
      paddingBottom: 10,
      color: 'var(--hr-text-secondary)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 5,
    },
    dayCell: {
      padding: 10,
      backgroundColor: 'var(--hr-card-background)',
      borderRadius: 'var(--hr-border-radius)',
      minHeight: 50,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      color: 'var(--hr-text-primary)',
      fontWeight: 'normal',
      cursor: 'pointer',
      boxShadow: 'none',
      transition: 'all var(--hr-transition-speed)',
      position: 'relative',
    },
    todayCell: {
      backgroundColor: '#9B5A2A',
      color: 'var(--hr-text-light)',
      fontWeight: 'bold',
      boxShadow: '0 0 10px #9B5A2A',
    },
    eventDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: '#0F6D66', // teal color dot for events
      marginTop: 4,
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 8,
      width: 300,
      boxShadow: '0 0 10px rgba(0,0,0,0.25)',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
    },
    modalInput: {
      width: '100%',
      padding: 8,
      fontSize: 16,
      marginBottom: 12,
      borderRadius: 4,
      border: '1px solid #ccc',
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
    },
    modalButton: {
      padding: '6px 12px',
      borderRadius: 4,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    saveButton: {
      backgroundColor: '#0F6D66',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#ccc',
      color: '#333',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={prevYear} style={styles.button} title="Previous Year">{'<<'}</button>
        <button onClick={prevMonth} style={styles.button} title="Previous Month">Prev</button>

        <h2 style={{ margin: '0 10px' }}>
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <button onClick={nextMonth} style={styles.button} title="Next Month">Next</button>
        <button onClick={nextYear} style={styles.button} title="Next Year">{'>>'}</button>
      </div>

      <div style={styles.daysOfWeek}>
        {daysOfWeek.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div style={styles.grid}>
        {calendarDays.map((day, idx) => {
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const dateStr = day
            ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null;

          const dayEvents = dateStr && events[dateStr] ? events[dateStr] : [];

          return (
            <div
              key={idx}
              style={{
                ...styles.dayCell,
                ...(isToday ? styles.todayCell : {}),
                color: day ? (isToday ? styles.todayCell.color : styles.dayCell.color) : 'transparent',
                backgroundColor: day ? (isToday ? styles.todayCell.backgroundColor : styles.dayCell.backgroundColor) : 'transparent',
                fontWeight: isToday ? styles.todayCell.fontWeight : styles.dayCell.fontWeight,
                boxShadow: isToday ? styles.todayCell.boxShadow : styles.dayCell.boxShadow,
                cursor: day ? 'pointer' : 'default',
              }}
              onClick={() => openAddEventModal(day)}
              title={dayEvents.map(e => e.title).join('\n')}
            >
              <div>{day || ''}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                {dayEvents.map((e, i) => (
                  <div key={i} style={styles.eventDot} title={e.title}></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Add Event on {selectedDate}</h3>
            <input
              type="text"
              placeholder="Event title"
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
              style={styles.modalInput}
              autoFocus
            />
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.saveButton }}
                onClick={saveEvent}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
