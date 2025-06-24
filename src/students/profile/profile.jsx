import React from 'react';
import './profile.css'; // We'll create this CSS file next

const StudentsProfile = () => {
  // Sample student data (in a real app, this would come from props or API)
  const student = {
    admission_number: 12345,
    name: "John Doe",
    photo: "https://via.placeholder.com/150",
    location: "Main Campus",
    contact_number: "+91 9876543210",
    parent_contact: "+91 9876543211",
    email: "john.doe@example.com",
    dob: "2000-05-15",
    address: "123 Main Street, Apt 4B",
    pin_code: "400001",
    city: "Mumbai",
    district: "Mumbai City",
    state: "Maharashtra",
    country: "India",
    documents_submitted: [
      "High School Certificate",
      "Transfer Certificate",
      "Aadhar Card Copy",
      "Passport Size Photos (4)",
      "Caste Certificate"
    ],
    education_qualification: "Bachelor of Science",
    course: "Computer Science",
    duration: "4 Years",
    exact_fee: 50000.00,
    discount: 5000.00,
    final_fee: 45000.00,
    batch_time: "Morning (9:00 AM - 1:00 PM)",
    gender: "Male"
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="students-profile-container">
    
      <main className="students-profile-main">
       

        <div className="students-profile-card students-profile-photo-card">
          <div className="students-profile-photo-container">
            <img 
              src={student.photo} 
              alt="Student" 
              className="students-profile-photo" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <h2 className="students-profile-name">{student.name}</h2>
            <p className="students-profile-meta">
              Admission No: {student.admission_number} | {student.course}
            </p>
          </div>
        </div>

        <div className="students-profile-card">
          <h3 className="students-profile-section-title">Personal Information</h3>
          <div className="students-profile-grid">
            <div className="students-profile-field">
              <span className="students-profile-label">Admission Number</span>
              <div className="students-profile-value">{student.admission_number}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Full Name</span>
              <div className="students-profile-value">{student.name}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Date of Birth</span>
              <div className="students-profile-value">{formatDate(student.dob)}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Gender</span>
              <div className="students-profile-value">{student.gender}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Contact Number</span>
              <div className="students-profile-value">{student.contact_number}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Parent Contact</span>
              <div className="students-profile-value">{student.parent_contact}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Email</span>
              <div className="students-profile-value">{student.email}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Location</span>
              <div className="students-profile-value">{student.location}</div>
            </div>
          </div>
        </div>

        <div className="students-profile-card">
          <h3 className="students-profile-section-title">Address Information</h3>
          <div className="students-profile-grid">
            <div className="students-profile-field">
              <span className="students-profile-label">Address</span>
              <div className="students-profile-value">{student.address}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">City</span>
              <div className="students-profile-value">{student.city}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">District</span>
              <div className="students-profile-value">{student.district}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">State</span>
              <div className="students-profile-value">{student.state}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Pin Code</span>
              <div className="students-profile-value">{student.pin_code}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Country</span>
              <div className="students-profile-value">{student.country}</div>
            </div>
          </div>
        </div>

        <div className="students-profile-card">
          <h3 className="students-profile-section-title">Academic Information</h3>
          <div className="students-profile-grid">
            <div className="students-profile-field">
              <span className="students-profile-label">Education Qualification</span>
              <div className="students-profile-value">{student.education_qualification}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Course</span>
              <div className="students-profile-value">{student.course}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Duration</span>
              <div className="students-profile-value">{student.duration}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Batch Time</span>
              <div className="students-profile-value">{student.batch_time}</div>
            </div>
          </div>
        </div>

        <div className="students-profile-card">
          <h3 className="students-profile-section-title">Fee Information</h3>
          <div className="students-profile-grid">
            <div className="students-profile-field">
              <span className="students-profile-label">Exact Fee</span>
              <div className="students-profile-value">{formatCurrency(student.exact_fee)}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Discount</span>
              <div className="students-profile-value">{formatCurrency(student.discount)}</div>
            </div>
            <div className="students-profile-field">
              <span className="students-profile-label">Final Fee</span>
              <div className="students-profile-value">{formatCurrency(student.final_fee)}</div>
            </div>
          </div>
        </div>

        <div className="students-profile-card">
          <h3 className="students-profile-section-title">Documents Submitted</h3>
          <ul className="students-profile-documents-list">
            {student.documents_submitted.map((doc, index) => (
              <li key={index} className="students-profile-document-item">{doc}</li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
};

export default StudentsProfile;