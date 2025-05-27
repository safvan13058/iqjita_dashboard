import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState } from 'react';
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

const sampleEmployees = [
    {
        id: 1,
        FullName: 'John Doe',
        ImageURL: '/default-profile.png',
        performanceCriteria: ['Teamwork', 'Punctuality', 'Skill'],
    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',
        performanceCriteria: ['Teamwork', 'Leadership', 'Communication'],
    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',
        performanceCriteria: ['Teamwork', 'Leadership', 'Communication'],
    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',
        performanceCriteria: ['Teamwork', 'Leadership', 'Communication'],
    },
    {
        id: 2,
        FullName: 'Jane Smith',
        ImageURL: '/default-profile.png',
        performanceCriteria: ['Teamwork', 'Leadership', 'Communication'],
    },
];

const PerformancePage = () => {
    const [marks, setMarks] = useState({});

    const handleMarkChange = (empId, criterion, value) => {
        setMarks(prev => ({
            ...prev,
            [empId]: {
                ...prev[empId],
                [criterion]: value,
            },
        }));
    };

    const handleSubmit = (empId) => {
        console.log("Submitted for:", empId, "Marks:", marks[empId]);
        // Add API call here
    };
    //     const handleAddCriteria = () => {
    //   // Example: Show modal or append to state
    //   alert('Add Criteria functionality goes here!');
    // };
    const [showCriteriaModal, setShowCriteriaModal] = useState(false);
    const [criteriaList, setCriteriaList] = useState(["Punctuality", "Teamwork", "Quality"]);

    const [newCriteria, setNewCriteria] = useState("");

    const handleAddCriteria = () => {
        if (newCriteria.trim()) {
            setCriteriaList([...criteriaList, newCriteria.trim()]);
            setNewCriteria("");
        }
    };

    const handleDeleteCriteria = (index) => {
        setCriteriaList(criteriaList.filter((_, i) => i !== index));
    };


    return (
        <div className="hr-page-container">
            <div className="hr-header-bar">
                <h2 className="hr-heading">Overall Performance Graph</h2>
                <button className="hr-btn hr-btn-primary" onClick={() => setShowCriteriaModal(true)}>
                    Criteria
                </button>

            </div>


            <div className="hr-card">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={samplePerformanceData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="emp1" stroke="#8884d8" name="John Doe" />
                        <Line type="monotone" dataKey="emp2" stroke="#82ca9d" name="Jane Smith" />
                        <Line type="monotone" dataKey="emp3" stroke="#ffc658" name="Alex Brown" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <h3 className="hr-subsection-heading">Individual Reviews</h3>
            <div className='hr-perform-cards'>
                {sampleEmployees.map((emp) => (
                    <div key={emp.id} className=" hr-card-perform hr-employee-box">
                        <div className="hr-header">
                            <img src={emp.ImageURL} className="hr-profile-img" alt="employee" />
                            <div className="hr-info">
                                <h3 className="hr-heading">{emp.FullName}</h3>
                                <p>ID: EMP-{emp.id}</p>
                            </div>
                        </div>

                        <div className="hr-details-grid">
                            {emp.performanceCriteria.map((criterion) => (
                                <div key={criterion}>
                                    <label className="emp-label">{criterion}</label>
                                    <input
                                        className="hr-input"
                                        type="number"
                                        value={marks[emp.id]?.[criterion] || ''}
                                        onChange={(e) => handleMarkChange(emp.id, criterion, e.target.value)}
                                        placeholder="Enter marks"
                                    />
                                </div>
                            ))}
                        </div>

                        <button className="hr-btn hr-btn-primary" onClick={() => handleSubmit(emp.id)}>Submit</button>
                    </div>
                ))}
            </div>
            {showCriteriaModal && (
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
            )}

        </div>
    );
};

export default PerformancePage;
