import React, { useState, useEffect } from 'react';
import './employee.css';
import { useNavigate } from 'react-router-dom';
const EmployeePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);
  const [errors, setErrors] = useState({
    FullName: false,
    Email: false,
    EmailExists: false,
    EmailInvalid: false
  });
  const user = JSON.parse(localStorage.getItem('user'))
  // const employees = [
  //   { id: 1, name: 'John Doe', email: 'john@company.com', department: 'HR', joiningDate: '2022-01-15' },
  //   { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Finance', joiningDate: '2023-04-20' },
  //   { id: 3, name: 'Raj Patel', email: 'raj@company.com', department: 'Engineering', joiningDate: '2021-09-01' },
  //   { id: 4, name: 'Fatima Ali', email: 'fatima@company.com', department: 'Marketing', joiningDate: '2024-02-11' },
  // ];
  useEffect(() => {
    fetch("https://software.iqjita.com/hr/employee.php?action=read")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const validData = data.filter(
            (emp) =>
              emp.FullName &&
              // emp.Email &&
              // emp.JoiningDate !== "0000-00-00" &&
              emp.EmployeeID
          );
          setEmployees(validData);
        }
      })
      .catch((err) => console.error("Error fetching employee data:", err));
  }, []);

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
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch('https://software.iqjita.com/hr/check_user_exists.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data.status === "exists";
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Assume email doesn't exist if there's an error
    }
  };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    handleChange(e); // Update form data

    // Clear previous timeout
    if (emailCheckTimeout) clearTimeout(emailCheckTimeout);

    // Only check if email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      // Set new timeout
      setEmailCheckTimeout(
        setTimeout(async () => {
          const exists = await checkEmailExists(email);
          setErrors(prev => ({ ...prev, EmailExists: exists }));
        }, 500) // Wait 500ms after typing stops
      );
    }
  };
  // const nextStep = () => setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate required fields before proceeding
      if (errors.EmailExists||!formData.FullName || !formData.Email || !/^\S+@\S+\.\S+$/.test(formData.Email)) {
        return; // Don't proceed to next step
      }
    }
    setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
  };
  const prevStep = () => setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
  return (
    <div className="hr-container">
      <div className="hr-header">
        <h1 className="hr-title">Employees</h1>
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
          <button className="hr-button" onClick={openModal}>+ Add Employee</button>
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
                <th>Email</th>
                <th>Department</th>
                <th>Joining Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1}</td>
                    <td>{emp.FullName}</td>
                    <td>{emp.Email}</td>
                    <td>{emp.Department}</td>
                    <td>{emp.JoiningDate}</td>
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

      {/* Modal */}
      {showModal && (
        <div className="hr-modal-overlay">
          <div className="hr-modal">
            <button onClick={closeModal} className="hr-modal-close">X</button>

            <p style={{ color: 'red' }}>{errorMessage}</p>

            <h2>Step {currentStep} of 3</h2>


            {currentStep === 1 && (
              <div className="hr-form-container">
                <h3>Personal Data & Education</h3>
                <div className="hr-form-grid">
                  <div className="hr-form-column">
                    <div className="hr-form-group">
                      <label htmlFor="FullName" className='hr-label'>Full Name</label>
                      <input id="FullName" name="FullName" value={formData.FullName} onChange={handleChange} />
                      {!formData.FullName && (
                        <span className="hr-error-message">Full Name is required</span>
                      )}
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="PhoneNumber" className='hr-label'>Phone Number</label>
                      <input id="PhoneNumber" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="Designation" className='hr-label'>Designation</label>
                      <select id="Designation" className="hr-input" name="Designation" value={formData.Designation} onChange={handleChange}>
                        <option value="">Select Designation</option>
                        <option value="HR Head">HR Head</option>
                        <option value="HR Executive cum Placement Officer">HR Executive cum Placement Officer</option>
                        <option value="Digital Marketer">Digital Marketer</option>
                        <option value="SEO Specialist">SEO Specialist</option>
                        <option value="Videographer cum Editor">Videographer cum Editor</option>
                        <option value="Graphic Designer">Graphic Designer</option>
                        <option value="GD Faculty">GD Faculty</option>
                        <option value="DM Faculty">DM Faculty</option>
                        <option value="English Trainer">English Trainer</option>
                        <option value="Management Faculty">Management Faculty</option>
                        <option value="Academic Head">Academic Head</option>
                        <option value="Full Stack Development Faculty">Full Stack Development Faculty</option>
                        <option value="AI & Data Science Faculty">AI & Data Science Faculty</option>
                        <option value="Office Admin">Office Admin</option>
                        <option value="Academic Counselor">Academic Counselor</option>
                        <option value="Exam Controller">Exam Controller</option>
                        <option value="LDC Coordinator">LDC Coordinator</option>
                        <option value="Operations Head">Operations Head</option>
                      </select>
                    </div>

                    <div className="hr-form-group">
                      <label htmlFor="DateOfBirth" className='hr-label'>Date of Birth</label>
                      <input id="DateOfBirth" name="DateOfBirth" type="date" value={formData.DateOfBirth} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label className="hr-label">Gender</label>
                      <div className="hr-radio-group ">
                        <label className='hr-label' >
                          <input
                            type="radio"
                            name="Gender"
                            value="Male"
                            checked={formData.Gender === 'Male'}
                            onChange={handleChange}
                          />
                          Male
                        </label>
                        <label className='hr-label'>
                          <input
                            type="radio"
                            name="Gender"
                            value="Female"
                            checked={formData.Gender === 'Female'}
                            onChange={handleChange}
                          />
                          Female
                        </label>
                        <label className='hr-label'>
                          <input
                            type="radio"
                            name="Gender"
                            value="Others"
                            checked={formData.Gender === 'Others'}
                            onChange={handleChange}
                          />
                          Others
                        </label>
                      </div>
                    </div>

                    <div className="hr-form-group">
                      <label htmlFor="Education " className='hr-label'>Education</label>
                      <input id="Education" name="Education" value={formData.Education} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="ProfileImage" className='hr-label'>Profile Image</label>
                      <input id="ProfileImage" name="ProfileImage" type="file" onChange={(e) => handleFileChange(e, setProfileImage)} />
                    </div>
                  </div>
                  <div className="hr-form-column">
                    <div className="hr-form-group">
                      <label htmlFor="Email" className='hr-label'>Email</label>
                      <input
                        id="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleEmailChange}  // Use the new handler
                      // className={errors.Email || errors.EmailInvalid || errors.EmailExists ? "error" : ""}
                      />
                      {!formData.Email && (
                        <span className="hr-error-message">Email is required</span>
                      )}
                      {formData.Email && !/^\S+@\S+\.\S+$/.test(formData.Email) && (
                        <span className="hr-error-message">Please enter a valid email address</span>
                      )}
                      {errors.EmailExists && (
                        <span className="hr-error-message">This email is already registered</span>
                      )}
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="Department" className='hr-label'>Department</label>
                      <select
                        id="Department"
                        name="Department"
                        className="hr-input"
                        value={formData.Department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Human_Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Management">Management</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Academics">Academics</option>
                      </select>

                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="JoiningDate" className='hr-label'>Joining Date</label>
                      <input id="JoiningDate" name="JoiningDate" type="date" value={formData.JoiningDate} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="Address" className='hr-label'>Address</label>
                      <input id="Address" name="Address" value={formData.Address} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="emergency_name" className="hr-label">Emergency Contact Name</label>
                      <input
                        type="text"
                        id="emergency_name"
                        name="emergency_name"
                        className="hr-input"
                        placeholder="Enter full name"
                        value={formData.emergency_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="hr-form-group">
                      <label htmlFor="emergency_relation" className="hr-label">Emergency Contact (Relation)</label>
                      <select
                        id="emergency_relation"
                        name="emergency_relation"
                        className="hr-input"
                        value={formData.emergency_relation}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Relation</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Friend">Friend</option>
                        <option value="Relative">Relative</option>
                        <option value="Other">Other</option>
                      </select>

                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="EmergencyContact" className='hr-label'>Emergency Contact</label>
                      <input id="EmergencyContact" name="EmergencyContact" value={formData.EmergencyContact} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="Certificates" className='hr-label'>Certificates</label>
                      <input id="Certificates" name="Certificates" value={formData.Certificates} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="CertificateImage" className='hr-label'>Certificate Image</label>
                      <input id="CertificateImage" name="CertificateImage" type="file" onChange={(e) => handleFileChange(e, setCertificateImage)} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="AgreementImage" className='hr-label'>Agreement Image</label>
                      <input id="AgreementImage" name="AgreementImage" type="file" onChange={(e) => handleFileChange(e, setAgreementImage)} />
                    </div>

                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="hr-form-container">
                <h3>Salary & Account Details</h3>
                <div className="hr-form-grid">
                  <div className="hr-form-column">
                    <div className="hr-form-group">
                      <div className="hr-form-group">
                        <label htmlFor="BasicSalary" className='hr-label'>Basic Salary</label>
                        <input id="NetSalaryMonthly" name="NetSalaryMonthly" value={formData.BasicSalary} onChange={handleChange} />
                      </div>
                      <label htmlFor="NetSalaryHourly" className='hr-label'>Hourly Salary</label>
                      <input id="NetSalaryHourly" name="NetSalaryHourly" value={formData.NetSalaryHourly} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="NetSalaryDaily" className='hr-label'>Daily Salary</label>
                      <input id="NetSalaryDaily" name="NetSalaryDaily" value={formData.NetSalaryDaily} onChange={handleChange} />
                    </div>
                    {/* <div className="hr-form-group">
                      <label htmlFor="NetSalaryMonthly" className='hr-label'>Monthly Salary</label>
                      <input id="NetSalaryMonthly" name="NetSalaryMonthly" value={formData.NetSalaryMonthly} onChange={handleChange} />
                    </div> */}

                  </div>
                  <div className="hr-form-column">
                    <div className="hr-form-group">
                      <label htmlFor="Allowances" className='hr-label'>Allowances</label>
                      <input id="Allowances" name="Allowances" value={formData.Allowances} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="AccountNumber" className='hr-label'>Bank Account Number</label>
                      <input id="AccountNumber" name="AccountNumber" value={formData.AccountNumber} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="IFSCCode" className='hr-label'>IFSC Code</label>
                      <input id="IFSCCode" name="IFSCCode" value={formData.IFSCCode} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="BankName" className='hr-label'>Bank Name</label>
                      <input id="BankName" name="BankName" value={formData.BankName} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="BankBranchName" className='hr-label'>Branch Name</label>
                      <input id="BankBranchName" name="BankBranchName" value={formData.BankBranchName} onChange={handleChange} />
                    </div>
                    <div className="hr-form-group">
                      <label htmlFor="AccountType" className='hr-label'>Account Type</label>
                      <select id="AccountType" name="AccountType" value={formData.AccountType} onChange={handleChange}>
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3>Confirmation</h3>
                <p>Review all details below before confirming:</p>
                <div className="hr-summary-container hr-form-container" style={{ overflow: 'auto' }}>
                  <div className="hr-summary-grid" style={{ display: 'flex', gap: '2rem' }}>
                    {[
                      [
                        "FullName", "Email", "PhoneNumber", "Department", "Designation", "JoiningDate",
                        "Address", "DateOfBirth", "EmergencyContact", "Education", "Certificates", "Branch"
                      ],
                      [
                        "NetSalaryHourly", "NetSalaryDaily", "BasicSalary", "Allowances",
                        "AccountNumber", "IFSCCode", "BankName", "BankBranchName", "AccountType",
                        "ProfileImage", "CertificateImage", "AgreementImage"
                      ]
                    ].map((fields, index) => (
                      <ul key={index} style={{ flex: 1 }}>
                        {fields.map((label) => {
                          const value =
                            label === "ProfileImage"
                              ? ProfileImage?.name || "null"
                              : label === "CertificateImage"
                                ? CertificateImage?.name || "null"
                                : label === "AgreementImage"
                                  ? AgreementImage?.name || "null"
                                  : formData[label] || "null";
                          return (
                            <li key={label}>
                              <div className="hr-label">{label.replace(/([A-Z])/g, " $1")}:</div > {value}
                            </li>
                          );
                        })}
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="hr-modal-actions">
              <button onClick={prevStep} disabled={currentStep === 1}>Back</button>
              <button onClick={clearForm} >
                Clear
              </button>
              {currentStep < 3 ? (
                <button onClick={nextStep}>Next</button>
              ) : (
                <button onClick={handleSubmit}>Confirm</button>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default EmployeePage;
