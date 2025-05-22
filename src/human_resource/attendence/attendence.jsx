import React, { useState } from 'react';
import './attendence.css';
const data = [
  {
    className: '10-A',
    name: 'John Doe',
    date: '2025-05-15',
    inTime: '09:00 AM',
    outTime: '06:00 PM',
    shift: 'Morning',
    totalDuration: '9h',
    status: 'Present',
    remark: 'On time',
  },
  {
    className: '10-B',
    name: 'Jane Smith',
    date: '2025-05-15',
    inTime: '09:30 AM',
    outTime: '06:30 PM',
    shift: 'Morning',
    totalDuration: '9h',
    status: 'Absent',
    remark: 'Sick leave',
  },
];

const AttendanceTable = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  // Get a unique list of employee names for the dropdown
  const employeeList = ['All', ...new Set(data.map(item => item.name))];

  const filterData = (filterType) => {
    const today = new Date();
    let filtered = [];

    switch (filterType) {
      case 'Today':
        filtered = data.filter(item => new Date(item.date).toDateString() === today.toDateString());
        break;
      case 'Yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        filtered = data.filter(item => new Date(item.date).toDateString() === yesterday.toDateString());
        break;
      case 'This Month':
        filtered = data.filter(item => 
          new Date(item.date).getMonth() === today.getMonth() &&
          new Date(item.date).getFullYear() === today.getFullYear()
        );
        break;
      default:
        filtered = data;
    }
    setFilteredData(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(value) ||
      item.className.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Filter by employee from dropdown
  const handleEmployeeFilter = (e) => {
    const selectedEmployee = e.target.value;
    if (selectedEmployee === 'All') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.name === selectedEmployee);
      setFilteredData(filtered);
    }
  };

  return (
    <>
      <h2 className="hr-title">Attendance</h2>
      
      <div className="attent-controls">
        <select className="attent-dropdown" onChange={handleEmployeeFilter}>
          {employeeList.map((employee, index) => (
            <option key={index} value={employee}>
              {employee}
            </option>
          ))}
        </select>
        
        <button className="attent-button" onClick={() => filterData('Today')}>Today</button>
        <button className="attent-button" onClick={() => filterData('Yesterday')}>Yesterday</button>
        <button className="attent-button" onClick={() => filterData('This Month')}>This Month</button>
        <button className="attent-button" onClick={() => setFilteredData(data)}>All</button>
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
            {filteredData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'attent-table-row' : 'attent-table-row-alt'}>
                <td>{item.className}</td>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>{item.inTime}</td>
                <td>{item.outTime}</td>
                <td>{item.shift}</td>
                <td>{item.totalDuration}</td>
                <td className={
                  item.status === 'Present' ? 'attent-status-present' : 
                  item.status === 'Absent' ? 'attent-status-absent' : 
                  'attent-status-leave'
                }>
                  {item.status}
                </td>
                <td>{item.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};


export default AttendanceTable;
