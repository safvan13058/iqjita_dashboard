import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import './performance.css'
const samplePerformanceData = [
    { name: 'Jan', emp1: 78, emp2: 85, emp3: 90 },
    { name: 'Feb', emp1: 82, emp2: 80, emp3: 88 },
    { name: 'Mar', emp1: 76, emp2: 89, emp3: 84 },
    { name: 'Apr', emp1: 90, emp2: 91, emp3: 86 },
    { name: 'Apr', emp1: 90, emp2: 91, emp3: 86 },
    { name: 'Apr', emp1: 90, emp2: 91, emp3: 86 },
    { name: 'Apr', emp1: 90, emp2: 91, emp3: 86 },
    { name: 'Apr', emp1: 90, emp2: 91, emp3: 86 },
];
const performanceCriteria = [
    "leader", "transation"
]
const sampleEmployees = [
    {
        id: 1,
        FullName: 'John Doe',
        ImageURL: '/default-profile.png',
    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',

    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',

    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',

    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',

    },
];

const PerformancePage = () => {
    // const [marks, setMarks] = useState({});
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('monthly'); // default filter
    const [lines, setLines] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [marks, setMarks] = useState({});

    const handleMarkChange = (empId, criterionId, value) => {
        setMarks(prev => ({
            ...prev,
            [empId]: {
                ...prev[empId],
                [criterionId]: parseInt(value) || ''
            }
        }));
    };
    //     const fetchData = (type) => {
    //   fetch(`https://software.iqjita.com//hr/performancegraph.php?type=${type}`)
    //     .then((res) => res.json())
    //     .then((json) => {
    //       // Transform data to flatten employee scores for Recharts
    //       console.log(json)
    //       const transformedData = json.map((day) => {
    //         const newDay = { name: day.name };
    //         Object.keys(day).forEach((key) => {
    //           if (key !== "name") {
    //             newDay[key] = day[key].score;  // Extract only the score number
    //           }
    //         });
    //         return newDay;
    //       });

    //       setData(transformedData);

    //       if (transformedData.length > 0) {
    //         const employees = Object.keys(transformedData[0]).filter((key) => key !== "name");
    //         const colors = [
    //           "#8884d8",
    //           "#82ca9d",
    //           "#ffc658",
    //           "#ff7300",
    //           "#0088fe",
    //           "#00c49f",
    //           "#ffbb28",
    //           "#d0ed57",
    //         ];

    //         const lineComponents = employees.map((emp, index) => (
    //           <Line
    //             key={emp}
    //             type="monotone"
    //             dataKey={emp}
    //             stroke={colors[index % colors.length]}
    //             name={emp}
    //             activeDot={{ r: 8 }}
    //           />
    //         ));

    //         setLines(lineComponents);
    //       } else {
    //         setLines([]);
    //       }
    //     })
    //     .catch((err) => {
    //       console.error("Failed to fetch performance data:", err);
    //       setData([]);
    //       setLines([]);
    //     });
    // };

    const fetchData = (type) => {
        fetch(`https://software.iqjita.com/hr/performancegraph.php?type=${type}`)
            .then((res) => res.json())
            .then((json) => {
                // Transform data to flatten employee scores for Recharts
                const transformedData = json.map((day) => {
                    const newDay = { name: day.name };
                    Object.keys(day).forEach((key) => {
                        if (key !== "name") {
                            newDay[key] = day[key].score; // Only include score
                        }
                    });
                    return newDay;
                });

                setData(transformedData);

                // ✅ Extract all unique employee names from ALL days
                const allEmployeeNames = new Set();
                transformedData.forEach((day) => {
                    Object.keys(day).forEach((key) => {
                        if (key !== "name") {
                            allEmployeeNames.add(key);
                        }
                    });
                });

                const employees = Array.from(allEmployeeNames);

                // Assign colors to each employee
                const colors = [
                    "#8884d8",
                    "#82ca9d",
                    "#ffc658",
                    "#ff7300",
                    "#0088fe",
                    "#00c49f",
                    "#ffbb28",
                    "#d0ed57",
                    "#a28bd4",
                    "#e667af",
                    "#71bfbf",
                    "#f48c06",

                    // 10 new colors:
                    "#e63946",
                    "#457b9d",
                    "#1d3557",
                    "#f1faee",
                    "#a8dadc",
                    "#ffb703",
                    "#fb8500",
                    "#6a4c93",
                    "#1982c4",
                    "#ff1654",
                ];


                // Generate Line components for each employee
                const lineComponents = employees.map((emp, index) => (
                    <Line
                        key={emp}
                        type="monotone"
                        dataKey={emp}
                        stroke={colors[index % colors.length]}
                        name={emp}
                        activeDot={{ r: 6 }}
                    />
                ));

                setLines(lineComponents);
            })
            .catch((err) => {
                console.error("Failed to fetch performance data:", err);
                setData([]);
                setLines([]);
            });
    };
    useEffect(() => {
        fetchData(filter);
    }, [filter]);

    const handleSubmit = async (empId) => {
        const ratings = marks[empId];
        if (!ratings) return alert("Please enter at least one rating.");

        for (const [criteriaId, score] of Object.entries(ratings)) {
            if (!score) continue;
            const res = await fetch('https://software.iqjita.com/hr/performance_api.php?action=create_rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    EmployeeID: empId,
                    CriteriaID: criteriaId,
                    Score: score,
                }),
            });

            const data = await res.json();
            if (data.status !== 'success') {
                alert(`Failed to submit rating for Employee ${empId}`);

            }
        }

        alert("Ratings submitted.");
        fetchData(filter)
    };


    // Load criteria from API on mount

    const [showCriteriaModal, setShowCriteriaModal] = useState(false);
    const [criteriaList, setCriteriaList] = useState([]);
    const [newCriteria, setNewCriteria] = useState('');
    const [newMaxScore, setNewMaxScore] = useState(10);

    useEffect(() => {
        fetchCriteria();
    }, []);

    const fetchCriteria = async () => {
        try {
            const res = await fetch('https://software.iqjita.com/hr/performance_api.php?action=get_criteria');
            const data = await res.json();
            if (data.status === 'success') {
                setCriteriaList(data.data);
            } else {
                alert('Failed to fetch criteria');
            }
        } catch (error) {
            console.error('Error fetching criteria:', error);
            alert('Error fetching criteria');
        }
    };

    const handleAddCriteria = async () => {
        const trimmedCriteria = newCriteria.trim();
        if (!trimmedCriteria) {
            return alert('Criteria name is required.');
        }

        const postData = {
            Department: 'HR',
            CriteriaName: trimmedCriteria,
            MaxScore: newMaxScore,
        };

        console.log('Sending to API:', postData);

        try {
            const res = await fetch('https://software.iqjita.com/hr/performance_api.php?action=create_criteria', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            const data = await res.json();
            console.log('Response:', data);

            if (data.status === 'success') {
                await fetchCriteria();
                setNewCriteria('');
                setNewMaxScore(10);
            } else {
                alert(data.message || 'Failed to add criteria');
            }
        } catch (error) {
            console.error('Error adding criteria:', error);
            alert('Error adding criteria');
        }
    };

    const handleDeleteCriteria = async (id) => {

        if (!window.confirm(`Are you sure you want to delete ?`)) {
            return;
        }

        try {
            const res = await fetch(`https://software.iqjita.com/hr/performance_api.php?action=delete_criteria&CriteriaID=${id}`, {
                method: 'GET', // or 'POST' but query param must be sent
            });
            const data = await res.json();
            if (data.status === 'success') {
                //   setCriteriaList(criteriaList);
                fetchCriteria();
            } else {
                alert('Failed to delete criteria');
            }
        } catch (error) {
            alert('Error deleting criteria');
            console.error(error);
        }
    };

    // On mount
    useEffect(() => {
        fetchEmployees();
        fetchCriteria();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('https://software.iqjita.com/hr/employee.php?action=read');
            const data = await res.json(); // data is the array itself
            if (Array.isArray(data)) {
                setEmployees(data);
            } else {
                console.error('Unexpected response:', data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };


    return (
        <div className="hr-page-container">
            <div className="hr-header-bar">
                <h2 className="hr-heading">Overall Performance Graph</h2>
                <button className="hr-btn hr-btn-primary" onClick={() => setShowCriteriaModal(true)}>
                    Criteria
                </button>

            </div>


            <div className="hr-card" style={{ width: '100%', height: 400 }}>
                <div className='hr-perform-filter'>
                    <select
                        id="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, "dataMax + 5"]} />
                        <Tooltip />
                        {/* <Legend /> */}
                        {lines}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <h3 className="hr-subsection-heading">Individual Reviews</h3>
            <div className='hr-perform-cards'>
                {employees.map(emp => (
                    <div key={emp.EmployeeID} className="hr-card-perform hr-employee-box">
                        <div className="hr-header">
                            <img src={emp.ProfileImage || '/default-profile.png'} className="hr-profile-img" alt="employee" />
                            <div className="hr-info">
                                <h3 className="hr-heading">{emp.FullName}</h3>
                                <p>ID: {emp.EmployeeID}</p>
                                <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="hr-details-grid">
                            {criteriaList.map((criterion) => (
                                <div key={criterion.CriteriaID}>
                                    <label className="emp-label">{criterion.CriteriaName}</label>
                                    <input
                                        className="hr-input hr-input-perf"
                                        type="number"
                                        value={marks[emp.EmployeeID]?.[criterion.CriteriaID] || ''}
                                        onChange={(e) => handleMarkChange(emp.EmployeeID, criterion.CriteriaID, e.target.value)}
                                        placeholder={`Max: ${criterion.MaxScore}`}
                                        max={parseInt(criterion.MaxScore)}
                                    />
                                </div>
                            ))}
                        </div>

                        <button className="hr-btn hr-btn-primary" onClick={() => handleSubmit(emp.EmployeeID)}>Submit</button>
                    </div>
                ))}

            </div>
            {/* {showCriteriaModal && (
                <div className="hr-criteria-overlay">
                    <div className="hr-criteria-modal">
                        <h3 className="hr-criteria-heading">Manage Performance Criteria</h3>

                        <ul className="hr-criteria-list">
                            {criteriaList.map((c, index) => (
                                <li key={index} className="hr-criteria-item">
                                    <span className="hr-criteria-name">{c}</span>
                                    <button onClick={() => handleDeleteCriteria(index)} className="hr-criteria-delete-btn">Delete</button>
                                </li>
                            ))}
                        </ul>

                        <div className="hr-criteria-form">
                            <input
                                type="text"
                                value={newCriteria}
                                onChange={(e) => setNewCriteria(e.target.value)}
                                className="hr-criteria-input"
                                placeholder="New Criteria"
                            />
                            <button onClick={handleAddCriteria} className="hr-criteria-add-btn">Add</button>
                        </div>

                        <button onClick={() => setShowCriteriaModal(false)} className="hr-criteria-close-btn">Close</button>
                    </div>
                </div>
            )} */}
            {showCriteriaModal && (
                <div className="hr-criteria-overlay">
                    <div className="hr-criteria-modal">
                        <h3 className="hr-criteria-heading">Manage Performance Criteria</h3>

                        <ul className="hr-criteria-list">
                            {criteriaList.map((c) => (
                                <li key={c.CriteriaID} className="hr-criteria-item">
                                    <span className="hr-criteria-name">
                                        {c.CriteriaName} (Max: {c.MaxScore})
                                    </span>
                                    <button
                                        onClick={() => handleDeleteCriteria(c.CriteriaID)}
                                        className="hr-criteria-delete-btn"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="hr-criteria-form">
                            <input
                                type="text"
                                value={newCriteria}
                                onChange={(e) => setNewCriteria(e.target.value)}
                                className="hr-criteria-input"
                                placeholder="New Criteria"
                            />
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={newMaxScore}
                                onChange={(e) => setNewMaxScore(Number(e.target.value))}
                                className="hr-maxscore-input"
                                placeholder="Max Score"
                                style={{ width: '80px', marginLeft: '10px' }}
                            />
                            <button onClick={handleAddCriteria} className="hr-criteria-add-btn">
                                Add
                            </button>
                        </div>

                        <button
                            onClick={() => setShowCriteriaModal(false)}
                            className="hr-criteria-close-btn"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default PerformancePage;
