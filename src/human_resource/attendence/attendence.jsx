import React, { useState, useEffect } from 'react';
import './attendence.css';

const AttendanceTable = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const fetchAttendance = async (filter = '') => {
    try {
      let url = 'https://software.iqjita.com/hr/attendence.php';
      if (filter === 'today' || filter === 'yesterday' || filter === 'this_month') {
        url += `?filter=${filter}`;
      } else if (filter.startsWith('select_month')) {
        const month = filter.split('=')[1];
        url += `?filter=select_month&month=${month}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setAllData(data);
      setFilteredData(data);

      const employees = ['All', ...new Set(data.map(item => item.FullName))];
      setEmployeeList(employees);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    }
  };

  useEffect(() => {
    fetchAttendance('today'); // Fetch all on load
  }, []);

  const filterData = (filterType) => {
    fetchAttendance(filterType.toLowerCase().replace(' ', '_'));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = allData.filter(item => {
      const employeeIdStr = item.EmployeeID ? item.EmployeeID.toString().toLowerCase() : "";
      const name = item.FullName ? item.FullName.toLowerCase() : "";
      const className = item.className ? item.className.toLowerCase() : "";

      return (
        employeeIdStr.includes(value) ||
        name.includes(value) ||
        className.includes(value)
      );
    });

    setFilteredData(filtered);
  };
  const handleMonthChange = (e) => {
    const month = e.target.value; // format: YYYY-MM
    setSelectedMonth(month);
    if (month) {
      filterData(`select_month=${month}`);
    } else {
      fetchAttendance(); // fetch all if no month selected
    }
  };

  const handleEmployeeFilter = (e) => {
    const selected = e.target.value;
    if (selected === 'All') {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter(item => item.FullName === selected);
      setFilteredData(filtered);
    }
  };

  return (
    <>
      <h2 className="hr-title">Attendance</h2>

      <div className="attent-controls">
        <select className="attent-dropdown" onChange={handleEmployeeFilter}>
          {employeeList.map((employee, index) => (
            <option key={index} value={employee}>{employee}</option>
          ))}
        </select>

        <button className="attent-button" onClick={() => filterData('Today')}>Today</button>
        <button className="attent-button" onClick={() => filterData('Yesterday')}>Yesterday</button>
        <button className="attent-button" onClick={() => filterData('This Month')}>This Month</button>
        {/* <button className="attent-button" onClick={() => fetchAttendance()}>All</button> */}
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="attent-search-input"
          style={{ width: '100px' }}
        />

        <input
          type="text"
          placeholder="Search by Name or Class"
          value={searchTerm}
          onChange={handleSearch}
          className="attent-search-input"
        />
      </div>

      <div className="attent-table-container">
        <table className="attent-attendance-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Shift</th>
              <th>Total Duration</th>
              <th>Status</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'attent-table-row' : 'attent-table-row-alt'}>
                  <td>{item.SystemEmployeeID || '-'}</td>
                  <td>{item.FullName || '-'}</td>
                  <td>{item.Date || '-'}</td>
                  <td>{item.CheckIn || '-'}</td>
                  <td>{item.CheckOut || '-'}</td>
                  <td>{item.shift || '-'}</td>
                  <td>{item.Duration || '-'}</td>
                  <td className={
                    item.Status === 'Present' ? 'attent-status-present' :
                      item.Status === 'Absent' ? 'attent-status-absent' :
                        'attent-status-leave'
                  }>
                    {item.Status || '-'}
                  </td>
                  <td
                    className={
                      item.remark
                        ? item.remark.toLowerCase().includes('late')
                          ? 'remark-late'
                          : item.remark.toLowerCase().includes('on time')
                            ? 'remark-ontime'
                            : ''
                        : ''
                    }
                  >
                    {item.remark || '-'}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>No attendance data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AttendanceTable;
