import React, { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

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
    buttonHover: {
      backgroundColor: 'var(--hr-button-hover-bg)',
      boxShadow: 'var(--hr-button-hover-shadow)',
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
      minHeight: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'var(--hr-text-primary)',
      fontWeight: 'normal',
      cursor: 'default',
      boxShadow: 'none',
      transition: 'all var(--hr-transition-speed)',
    },
    todayCell: {
      backgroundColor: '#9B5A2A',  // Your brand brown color for highlight
      color: 'var(--hr-text-light)',
      fontWeight: 'bold',
      boxShadow: '0 0 10px #9B5A2A',
    }
  };

  // Hover effect for buttons - optional, can add if needed using onMouseEnter/onMouseLeave

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
                cursor: day ? 'default' : 'auto',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
