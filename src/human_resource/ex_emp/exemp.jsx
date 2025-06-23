import React, { useState, useEffect } from 'react';
import '../employees/employee.css';
import { useNavigate } from 'react-router-dom';
const EXEmployeePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table');
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [employees, setEmployees] = useState([]);
    const [status, setStatus] = useState('resign');
    const user = JSON.parse(localStorage.getItem('user'))
    // const employees = [
    //   { id: 1, name: 'John Doe', email: 'john@company.com', department: 'HR', joiningDate: '2022-01-15' },
    //   { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Finance', joiningDate: '2023-04-20' },
    //   { id: 3, name: 'Raj Patel', email: 'raj@company.com', department: 'Engineering', joiningDate: '2021-09-01' },
    //   { id: 4, name: 'Fatima Ali', email: 'fatima@company.com', department: 'Marketing', joiningDate: '2024-02-11' },
    // ];
    useEffect(() => {
        fetch(`https://software.iqjita.com/hr/employee.php?action=read&status=${status}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const validData = data.filter(
                        (emp) =>
                            emp.FullName &&
                            emp.Email &&
                            emp.JoiningDate !== "0000-00-00" &&
                            emp.EmployeeID
                    );
                    setEmployees(validData);
                }
            })
            .catch((err) => console.error("Error fetching employee data:", err));
    }, [status]);

    const filteredEmployees = employees.filter(emp =>
        emp.FullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setCurrentStep(1);
    };




    const [formData, setFormData] = useState({
        FullName: "",
        Email: "",
        PhoneNumber: "",
        Department: "",
        Designation: "",
        JoiningDate: "",
        Address: "",
        DateOfBirth: "",
        EmergencyContact: "",
        Education: "",
        Certificates: "",
        Branch: user.branch_id,
        NetSalaryHourly: "",
        NetSalaryDaily: "",
        NetSalaryMonthly: "",
        BasicSalary: "",
        Allowances: "",
        AccountNumber: "",
        IFSCCode: "",
        BankName: "",
        BankBranchName: "",
        Gender: "",
        AccountType: "Savings",
        emergency_relation: "",
        emergency_name: "",
        Addedby: user.name,
    });

    const [ProfileImage, setProfileImage] = useState(null);
    const [CertificateImage, setCertificateImage] = useState(null);
    const [AgreementImage, setAgreementImage] = useState(null);

    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   setFormData((prev) => ({ ...prev, [name]: value }));
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Convert value to number only for calculations
        const numericValue = parseFloat(value);

        if (name === 'NetSalaryMonthly') {
            const daily = numericValue ? (numericValue / 30).toFixed(2) : '';
            const hourly = daily ? (daily / 8).toFixed(2) : '';

            setFormData((prevData) => ({
                ...prevData,
                BasicSalary: value,
                NetSalaryDaily: daily,
                NetSalaryHourly: hourly,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };


    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };
    const handleSubmit = () => {
        setErrorMessage("");
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        if (ProfileImage) data.append("ProfileImage", ProfileImage);
        if (CertificateImage) data.append("CertificateImage", CertificateImage);
        if (AgreementImage) data.append("AgreementImage", AgreementImage);

        // Debug log
        for (let pair of data.entries()) {
            console.log(pair[0] + ": ", pair[1]);
        }

        fetch("https://software.iqjita.com/hr/employee.php?action=create", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    // alert(data.message);
                    closeModal()

                } else {
                    setErrorMessage(data.message || "Failed to create employee.");
                }
            })
            .catch((err) => {
                console.error("Error:", err);
                setErrorMessage("An error occurred while submitting the form.");
            });

    };

    const clearForm = () => {
        setFormData({
            FullName: "",
            Email: "",
            PhoneNumber: "",
            Department: "",
            Designation: "",
            JoiningDate: "",
            Address: "",
            DateOfBirth: "",
            EmergencyContact: "",
            Education: "",
            Certificates: "",
            Branch: "",
            NetSalaryHourly: "",
            NetSalaryDaily: "",
            NetSalaryMonthly: "",
            BasicSalary: "",
            Allowances: "",
            AccountNumber: "",
            IFSCCode: "",
            BankName: "",
            BankBranchName: "",
            Gender: "",
            emergency_relation: "",
            emergency_name: "",
            AccountType: "Savings",
            // Add other fields as needed
        });
        setCurrentStep(1); // Optional: reset to step 1
        setErrorMessage('');
    };
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/hr/employee/${id}`);
    };


    const nextStep = () => setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
    const prevStep = () => setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
    return (
        <div className="hr-container">
            <div className="hr-header">
                <h1 className="hr-title">Ex-Employees</h1>
                <div className='hr-headbtn'>
                    <div className="hr-toggle-buttons">
                        <button
                            className={`hr-toggle-button ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            List Table
                        </button>
                        <button
                            className={`hr-toggle-button ${viewMode === 'card' ? 'active' : ''}`}
                            onClick={() => setViewMode('card')}
                        >
                            Card
                        </button>
                    </div>
                    <select
                        className="hr-filter-dropdown"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                       
                        <option value="resign">Resigned</option>
                        <option value="termination">Terminated</option>
                    </select>
                </div>
            </div>

            <input
                type="text"
                className="hr-search"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />



            {viewMode === 'table' ? (
                <div className="hr-table-container">
                    <table className="hr-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                               
                                <th>Department</th>
                                <th>Joining Date</th>
                                 <th>{status} Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp, index) => (
                                    <tr key={emp.id}>
                                        <td>{index + 1}</td>
                                        <td>{emp.FullName}</td>
                                        
                                        <td>{emp.Department}</td>
                                        <td>{emp.JoiningDate}</td>
                                        <td>{emp.status_date}</td>
                                        <td>
                                            <button
                                                className="hr-action-button"
                                                onClick={() => handleView(emp.EmployeeID)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No employees found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="hr-card-grid">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                            <div className="hr-employee-card" key={emp.EmployeeID}>
                                <div className='hr-card-img-div'>
                                    <img
                                        src={emp.ProfileImage || "/default-profile.png"}
                                        alt={emp.FullName}
                                        className="hr-card-img"
                                    />
                                </div>
                                <div>
                                    <h3>{emp.FullName}</h3>
                                    <p>Email: {emp.Email}</p>
                                    <p>Department: {emp.Department}</p>
                                    <p>Joining: {emp.JoiningDate}</p>
                                    <button className='hr-button' onClick={() => alert(`Viewing ${emp.FullName}`)}>
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="hr-text">No employees found.</p>
                    )}
                </div>

            )}




        </div>
    );
};

export default EXEmployeePage;
