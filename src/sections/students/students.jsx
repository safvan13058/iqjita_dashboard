import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './students.css';
import { format } from 'date-fns';
import { FaPen, FaSpinner } from "react-icons/fa";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import recipt from '../Recipts/studentdata.html'
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { FaDownload, FaWhatsapp } from 'react-icons/fa';
// Add at top of file

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null)
  const [transactions, setTransactions] = useState([]);
  const [tranpop, setTranpop] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [receipt, setReceiptUrl] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showModal, setShowModal] = useState(false);
  const [installmentStarted, setInstallmentStarted] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  const [showPopup, setShowPopup] = useState(false);
  const cardRef = useRef(null);

  // const handleDownloadPDF = () => {
  //   html2canvas(cardRef.current, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'px',
  //       format: [canvas.width, canvas.height],
  //     });
  //     pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  //     pdf.save(`${selectedStudent.name}_IDCard.pdf`);
  //   });
  // };

  const handleDownloadPDF = () => {
    const background = new Image();
    background.src = '/idcard/idcardstu.jpg';

    background.onload = () => {
      html2canvas(cardRef.current, {
        scale: 5,
        useCORS: true,
        allowTaint: false,  // Prevent using tainted canvas
        backgroundColor: null
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'cm',
          format: [5, 8],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, 5, 8);
        pdf.save(`${selectedStudent.name}_IDCard.pdf`);
      });
    };
  };



  const [startingDate, setStartingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // returns "YYYY-MM-DD"
  });
  const [periodDays, setPeriodDays] = useState(30);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "", location: "", contact_number: "", parent_contact: "", email: "", dob: "",
    address: "", pin_code: "", city: "", district: "", state: "", country: "",
    documents_submitted: "", education_qualification: "", course: "", duration: "",
    exact_fee: "", discount: "", final_fee: "", batch_time: "", gender: "", updated_by: ""
  });


  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  // useEffect(() => {
  //     fetchStatus();
  // }, [selectedStudent]);
  const fetchStatus = async (admission_no) => {
    console.log("working status")
    // const newStatus = {};
    // for (const student of selectedStudent) {
    try {
      const res = await fetch("https://software.iqjita.com/pendingfee.php?mode=check_started", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admission_id: admission_no }),
      });
      const data = await res.json();
      console.log(data)
      setInstallmentStarted(data.started);
      // newStatus[student.admission_number] = data.started;
    } catch (err) {
      console.error("Error checking installments:", err);
    }
  }

  const handleStartBatch = async () => {
    try {
      const response = await fetch(`https://software.iqjita.com/pendingfee.php?mode=set_installments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          admission_id: selectedStudent.admission_no, // assuming 'id' is admission_number
          starting_date: startingDate,
          period_days: parseInt(periodDays)
        })
      });


      const result = await response.json();
      console.log(`Installments set successfull${result}`)
      if (result.status === 'success') {
        console.log("Installments: " + JSON.stringify(result, null, 2));

        alert('Installments set successfully');
        setShowModal(false);
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  const handleEditClick = () => {
    if (selectedStudent) {
      setEditForm({
        name: selectedStudent.name || "",
        photo: selectedStudent.photo || "",
        location: selectedStudent.location || "",
        contact_number: selectedStudent.contact_number || "",
        parent_contact: selectedStudent.parent_contact || "",
        email: selectedStudent.email || "",
        dob: selectedStudent.dob || "",
        address: selectedStudent.address || "",
        pin_code: selectedStudent.pin_code || "",
        city: selectedStudent.city || "",
        district: selectedStudent.district || "",
        state: selectedStudent.state || "",
        country: selectedStudent.country || "",
        documents_submitted: selectedStudent.documents_submitted || "",
        education_qualification: selectedStudent.education_qualification || "",
        course: selectedStudent.course || "",
        duration: selectedStudent.duration || "",
        exact_fee: selectedStudent.exact_fee || "",
        discount: selectedStudent.discount || "",
        final_fee: selectedStudent.final_fee || "",
        batch_time: selectedStudent.batch_time || "",
        gender: selectedStudent.gender || "",
        updated_by: selectedStudent.updated_by || ""
      });

      setShowEditModal(true);
    }
  };
  const handlePhotoUploadClick = () => {
    document.getElementById("photoInput").click();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedStudent.admission_number) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("admission_number", selectedStudent.admission_number);

    try {
      const response = await fetch("https://software.iqjita.com/updatephoto.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        // Update student's photo path in UI
        setSelectedStudent((prev) => ({
          ...prev,
          photo: data.photo_path,
        }));
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      alert("Upload error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };
  const handleUpdateStatus = async (statusValue) => {
    const confirmed = window.confirm(`Are you sure you want to set status to "${statusValue}"?`);

    if (!confirmed) return; // exit if user clicks "Cancel"

    const res = await fetch("https://software.iqjita.com/update_student_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: selectedStudent.admission_number, // Replace this with actual student ID
        status: statusValue,
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert(`Status set to ${statusValue}`);
      // Optionally refresh data or update UI
    } else {
      alert("Failed to update status: " + result.message);
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://software.iqjita.com/administration.php?action=updatestudentdetails&admission_number=${selectedStudent.admission_number}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      const result = await res.json();

      if (result.status === "success") {
        console.log("editdata", result)
        // alert("Student updated successfully!");
        setShowEditModal(false);
        // Optionally: refresh data here
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Network error.");
      console.error(err);
    }
  };



  const handlePrint = (student) => {
    const fullStudentData = [{
      status: student.status,
      message: student.message,
      student_id: student.admission_no,
      photo: student.photo,
      name: student.name,
      dob: student.dob,
      gender: student.gender,
      email: student.email,
      contact_number: student.contact_number,
      parent_contact: student.parent_contact,
      address: student.address,
      location: student.location,
      city: student.city,
      district: student.district,
      state: student.state,
      country: student.country,
      pin_code: student.pin_code,
      education_qualification: student.education_qualification,
      documents_submitted: student.documents_submitted,
      course: student.course,
      duration: student.duration,
      exact_fee: student.exact_fee,
      admission_fee: student.admission_fee,
      discount: student.discount,
      final_fee: student.final_fee,
      batch_time: student.batch_time,
      branch: student.branch,
      updated_by: student.updated_by,
      course_details: {
        // id: course.id,
        course: student.course,
        duration: student.duration,
        exact_fee: student.exact_fee,
        admission_fee: student.admission_fee,
        discount: student.discount,
        install1: student.install1,
        install2: student.install2,
        install3: student.install3,
        install4: student.install4,
        install5: student.install5,


      }
    }];
    // Store student data in localStorage
    localStorage.setItem("selectedStudentdata", JSON.stringify(fullStudentData));

    // Open the new print page
    window.open("/recipts/studentdata.html", "_blank");
  };
  const ReceiptPrint = (Receipt) => {
    // Store student data in localStorage


    localStorage.setItem("Receiptdata", JSON.stringify(Receipt));

    // Open the new print page
    window.open("/recipts/billreceipt.html", "_blank");
  };
  const handleAdmissionFeePayment = () => {
    setIsModalOpen(true);
    setIsSuccess(false);
    setReceiptUrl("");
    setResponseMessage("");
  };



  const submitPayment = async () => {
    setIsLoading(true);
    setResponseMessage("");

    const payload = {
      admission_number: selectedStudent.admission_no,
      course: selectedStudent.s_course,
      final_fee: selectedStudent.final_fees,
      updated_by: user.name,
      payment_method: paymentMethod
    };

    try {
      const response = await fetch("https://software.iqjita.com/administration.php?action=admission_fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let data = await response.json();
      if (data.status === "success") {
        setIsSuccess(true);
        setResponseMessage("Payment updated successfully!");
        console.log("admission", data);

        // Call transaction API after success
        await recordTransaction(1000, "credit", "Admission", data, selectedStudent.admission_no);

      } else {
        setResponseMessage("Failed to update payment.");
      }
    } catch (error) {
      setResponseMessage("Error processing payment. Please try again.");
    }

    setIsLoading(false);
  };
  const recordTransaction = async (amount, type, data, payment_method, category, remark) => {
    const transactionPayload = {
      amount,
      type,
      category,
      payment_method,
      remark,
      updated_by: user.name
    };

    try {
      const transactionResponse = await fetch("https://software.iqjita.com/administration.php?action=transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transactionPayload)
      });

      const transactionData = await transactionResponse.json();

      if (transactionData.status === "success") {
        const result = {
          ...data,
          bill_number: transactionData.bill_number

        }
        setReceiptUrl(result);
        console.log("Transaction recorded successfully:", transactionData);
      } else {
        console.error("Failed to record transaction.");
      }
    } catch (error) {
      console.error("Error recording transaction:", error);
    }
  };
  const fetchTransactions = async (id) => {
    console.log("id===", id)
    try {
      const response = await fetch("https://software.iqjita.com/administration.php?action=listindividualtransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      // ✅ Log the raw response
      const rawText = await response.text();
      console.log("🔍 Raw API Response:", rawText);

      // ✅ Try parsing the JSON
      const data = JSON.parse(rawText.trim());

      if (data.status === "success") {
        setTransactions(data.transaction);
        setTranpop(true);
      } else {
        alert("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("🚨 Error fetching transactions:", error);
      alert("Error fetching transactions");
    }
  };



  const handlePayment = (student) => {
    // Navigate to FeeForm page with student data as state
    navigate('/fee-payment', { state: { student } });
  };
  const fetchStudents = async (course) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://software.iqjita.com/administration.php?action=liststudentbycourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course })
      });

      // ✅ Read the raw response as text
      const text = await response.text();
      console.log("🔍 Raw API Response:", text);

      // ✅ Extract the second JSON object
      const jsonObjects = text.trim().split("\n");
      const lastJson = jsonObjects.pop(); // Take the second (last) JSON object

      let result;
      try {
        result = JSON.parse(lastJson); // ✅ Parse the correct JSON
      } catch (error) {
        throw new Error("❌ Invalid JSON response from server:\n" + text);
      }

      // ✅ Check if API returned success or error
      if (result.status === "success") {
        console.log("✅ Students Fetched Successfully:", result.students);
        setStudents(result.students || []);
      } else {
        throw new Error(result.message || "❌ Failed to fetch students.");
      }
    } catch (err) {
      setError(err.message);
      console.error("🚨 Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchCourseOptions = async () => {
    console.log("working");
    try {
      const response = await fetch("https://software.iqjita.com/administration.php?action=getcoursedetails");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text(); // Read raw response
      console.log("Raw Response:", text); // Debugging: check raw response

      // Try parsing JSON safely
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        throw new Error("Failed to parse JSON: " + jsonError.message);
      }

      console.log("Parsed Data:", data);

      if (data.status === "success") {
        const formattedCourses = data.courses.map(course => ({
          course: course.course,
        }));

        console.log("✅ Transformed Course Options:", formattedCourses);

        setCourses(formattedCourses); // Set the fetched courses in state

        // ✅ Set the first course as selected
        if (formattedCourses.length > 0) {
          console.log(formattedCourses[0])
          setSelectedCourse(formattedCourses[0].course);

        }
      } else {
        console.error("❌ Failed to fetch courses:", data);
      }
    } catch (error) {
      console.error("🚨 Error fetching courses:", error.message);
    }
  };

  useEffect(() => {
    fetchCourseOptions();
  }, []);
  const fetchStudentDetails = async (admissionNumber) => {
    setViewLoading(true);
    setViewError(null);

    try {
      const response = await fetch("https://software.iqjita.com/administration.php?action=liststudentbyadmn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admn: admissionNumber })
      });

      // ✅ Read raw response as text
      const text = await response.text();
      console.log("🔍 Raw API Response:", text);

      // ✅ Extract the second JSON object
      const jsonObjects = text.trim().split("\n");
      const lastJson = jsonObjects.pop(); // Take the second (last) JSON object

      let result;
      try {
        result = JSON.parse(lastJson); // ✅ Parse the correct JSON
      } catch (error) {
        throw new Error("❌ Invalid JSON response from server:\n" + text);
      }

      // ✅ Check if API returned success or error
      if (result.status === "success") {
        console.log("✅ Student Details Fetched:", result.student[0]);
        // fetchStatus()
        setSelectedStudent(result.student[0] || {}); // ✅ Ensure we get the first student object

      } else {
        throw new Error(result.message || "❌ Failed to fetch student details.");
      }
    } catch (err) {
      setViewError(err.message);
      console.error("🚨 Error fetching student details:", err);
    } finally {
      setViewLoading(false);
    }
  };
  const handleViewStudent = (admissionNumber) => {
    fetchStudentDetails(admissionNumber);
    fetchStatus(admissionNumber);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setViewError(null);
  };


  useEffect(() => {
    fetchStudents(selectedCourse);
  }, [selectedCourse]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm) ||
    student.admission_number.toString().includes(searchTerm) ||
    student.contact_number.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="students-container">
      <h1>Student Management</h1>

      <div className="controls">
        <h3>Student of {selectedCourse}</h3>
        <div className="search-filter">


          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-select"
            style={{ width: '100%' }} // ✅ Proper inline style
          >
            {courses.map(course => (
              <option key={course.course} value={course.course}>
                {course.course}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search students..."
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {loading && <div className="loading">Loading students...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Admission No.</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Parent Contact</th>
              <th>Email</th>
              <th>Course</th>
              <th>Fee</th>
              <th>Batch Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.admission_number}>
                  <td>{student.admission_number}</td>
                  <td>{student.name}</td>
                  <td>{student.contact_number}</td>
                  <td>{student.parent_contact}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>Rs.{student.final_fee}</td>
                  <td>{student.batch_time}</td>
                  <td>
                    <button className="action-btn view-btn" onClick={() => handleViewStudent(student.admission_number)}>View</button>
                    {/* <button className="action-btn edit-btn">Edit</button> */}
                    <button className="action-btn edit-btn" onClick={() => handlePayment(student)}>payment</button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">
                  {students.length === 0 ? 'No students found for this course' : 'No matching students found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-stu" onClick={handleCloseModal}>×</button>

            {viewLoading && <div className="loading">Loading student details...</div>}
            {viewError && <div className="error">Error: {viewError}</div>}

            {!viewLoading && !viewError && (
              <>
                <h2>Student Details</h2>
                <div className="student-details-grid">
                  <div className="detail-section section1">
                    <div className='pr-container'>
                      <h3>Personal Information</h3>
                      <p><strong>Name:</strong> {selectedStudent.name}</p>
                      <p><strong>Admission Number:</strong> {selectedStudent.admission_no}</p>
                      <p><strong>Contact:</strong> {selectedStudent.contact_number}</p>
                      <p><strong>Parent Contact:</strong> {selectedStudent.parent_contact}</p>
                      <p><strong>Email:</strong> {selectedStudent.email}</p>
                      <p><strong>Location:</strong> {selectedStudent.location}</p>
                    </div>
                    <div className="pr-image">
                      <div className="pr-image-wrapper">
                        <img
                          src={`https://software.iqjita.com/${selectedStudent.photo}`}
                          alt="Student"
                        />
                        <button
                          className="edit-photo-icon"
                          onClick={handlePhotoUploadClick}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <FaSpinner className="fa-spin" />
                          ) : (
                            <FaPen />
                          )}
                        </button>

                        <input
                          type="file"
                          id="photoInput"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </div>
                    </div>



                  </div>

                  <div className="detail-section">
                    <h3>Course Information</h3>
                    <p><strong>Course:</strong> {selectedStudent.s_course}</p>
                    <p><strong>Duration:</strong> {selectedStudent.duration} MONTHS</p>
                    <p><strong>Batch Time:</strong> {selectedStudent.batch_time}</p>
                    <p><strong>Exact Fee:</strong>  {selectedStudent.exact_fee}</p>
                    <p><strong>Discount:</strong> {selectedStudent.discount}</p>
                    <p><strong>Offer price:</strong> {selectedStudent.a_offer_price}</p>
                    <p><strong>One-time payment:</strong> {selectedStudent.a_one_time_payment_discount_percentage}%</p>
                    <p><strong>Group Discount:</strong> {selectedStudent.a_group_discount_percentage}%</p>
                    <p><strong>Final Fee:</strong> {selectedStudent.final_fees}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Payment Information</h3>
                    <p><strong>Admission Fee:</strong> {selectedStudent.admission_fee}</p>
                    <p><strong>Total Paid:</strong>  {selectedStudent.TotalPaid}</p>
                    <p><strong>Total Pending:</strong>  {selectedStudent.TotalPending}</p>

                    <h4>Installments</h4>
                    <p><strong>Installment 1:</strong>  {selectedStudent.install1} (Balance:  {selectedStudent.bal1})</p>
                    <p><strong>Installment 2:</strong>  {selectedStudent.install2} (Balance:  {selectedStudent.bal2})</p>
                    <p><strong>Installment 3:</strong> {selectedStudent.install3} (Balance:  {selectedStudent.bal3})</p>
                    <p><strong>Installment 4:</strong> {selectedStudent.install4} (Balance:  {selectedStudent.bal4})</p>
                    <p><strong>Installment 5:</strong> {selectedStudent.install5} (Balance: {selectedStudent.bal5})</p>
                    <div className='ad-pop'>
                      <button onClick={() => fetchTransactions(selectedStudent.admission_number)}>View transations</button>
                      {selectedStudent.admission_fee === null && (
                        <button className="pay-admission-fee-btn" onClick={handleAdmissionFeePayment}>
                          Pay Admission Fee
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Additional Information</h3>
                    <p><strong>Address:</strong> {selectedStudent.address || 'N/A'}</p>
                    <p><strong>Pin Code:</strong> {selectedStudent.pin_code || 'N/A'}</p>
                    <p><strong>City:</strong> {selectedStudent.city || 'N/A'}</p>
                    <p><strong>District:</strong> {selectedStudent.district || 'N/A'}</p>
                    <p><strong>State:</strong> {selectedStudent.state || 'N/A'}</p>
                    <p><strong>Country:</strong> {selectedStudent.country || 'N/A'}</p>
                    <p><strong>Documents Submitted:</strong>{JSON.stringify(selectedStudent.documents_submitted) || 'N/A'}</p>
                    <p><strong>Education Qualification:</strong> {selectedStudent.education_qualification || 'N/A'}</p>
                    <p><strong>Referred by:</strong> {selectedStudent.a_refferedby || 'N/A'}</p>
                    <p><strong>Ref category:</strong> {selectedStudent.a_refcategory || 'N/A'}</p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="action-btn edit-btn" onClick={() => setShowPopup(true)}>
                    ID Card
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleUpdateStatus("left")}
                  >
                    Quit
                  </button>
                  {!installmentStarted ? (
                    <button
                      className="action-btn edit-btn"
                      onClick={() => setShowModal(true)}
                    >
                      Start Batch
                    </button>
                  ) : (
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleUpdateStatus("finished")}
                    >
                      Finish Batch
                    </button>
                  )}

                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <button className="action-btn edit-btn" onClick={handleEditClick}>
                      Edit Details
                    </button>
                  )}


                  <button className="action-btn print-btn" onClick={() => handlePrint(selectedStudent)}>
                    Print Details
                  </button>
                  {/* <button className="action-btn close-btn" onClick={handleCloseModal}>
                    Close
                  </button> */}
                </div>
              </>
            )}
            {showPopup && (
              <div className="idcard-overlay" >
                <div className="idcard-modal">
                  <button onClick={() => setShowPopup(false)} className="idcard-close-btn">×</button>
                  <div ref={cardRef} className="idcard-content">
                    <div className="idcard-background">
                      <img
                        src="/idcard/idcardstu.jpg"
                        className="idcard-bg-image"
                        alt="Background"
                      />
                      <img
                        src={`https://software.iqjita.com/${selectedStudent.photo}`}
                        alt="Student"
                        className="idcard-photo"
                        crossOrigin="anonymous"
                      />
                      <div className="idcard-name"><h3>{
                        selectedStudent.name
                          .toLowerCase()
                          .split(' ')
                          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')
                      }</h3></div>
                      <div className="idcard-text">
                        <p> {selectedStudent.admission_no}</p>
                        <p>{
                          selectedStudent.s_course
                            .replace(/.*IN\s/i, '')      // Removes everything before and including "IN"
                            .replace(/\s*\(.*\)/, '')    // Removes anything in parentheses (e.g., "(offline)")
                            .trim()
                        }</p>
                        <p> {selectedStudent.email}</p>
                        <p>
                          {`+${selectedStudent.contact_number.slice(0, 2)} ${selectedStudent.contact_number.slice(2)}`}
                        </p>
                      </div>
                      <div className="idcard-qrcode">
                        <Barcode
                          value={`https://iqjita.com/s/${selectedStudent.admission_no}`}
                          // value={selectedStudent.admission_no}
                          width={.4}
                          height={20}
                          displayValue={false}
                          background="none"
                          lineColor="#000000"
                          format="CODE128"
                        />
                        <div className='idcard-qrcode-footer'>IQJITA 2025/26</div>
                      </div>
                      <div className='idcard-footer'>
                        IQ 1234
                      </div>
                    </div>
                  </div>
                  <div className="idcard-actions">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="idcard-action-btn whatsapp-btn"
                      title="Share on WhatsApp"
                    >
                      <span>Whatsapp</span>
                      <FaWhatsapp className="action-icon" />
                      
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadPDF();
                      }}
                      className="idcard-action-btn download-btn"
                      title="Download PDF"
                      role="button"
                    >
                      <span>Download PDF</span>
                      <FaDownload className="action-icon" />
                      
                    </a>

                    
                  </div>


                </div>

              </div>
            )}
            {showEditModal && (user.role === 'admin' || user.role === 'superadmin') && (
              <div className="stude-modal-overlay">
                <div className="stude-modal-content">
                  <h2>Edit Student Details</h2>
                  <form onSubmit={handleUpdateSubmit}>
                    <label>
                      Name:
                      <input name="name" value={editForm.name} onChange={handleInputChange} placeholder="Name" />
                    </label>



                    <label>
                      Location:
                      <input name="location" value={editForm.location} onChange={handleInputChange} placeholder="Location" />
                    </label>

                    <label>
                      Contact Number:
                      <input name="contact_number" value={editForm.contact_number} onChange={handleInputChange} placeholder="Contact Number" />
                    </label>

                    <label>
                      Parent Contact:
                      <input name="parent_contact" value={editForm.parent_contact} onChange={handleInputChange} placeholder="Parent Contact" />
                    </label>

                    <label>
                      Email:
                      <input name="email" value={editForm.email} onChange={handleInputChange} placeholder="Email" />
                    </label>

                    <label>
                      Date of Birth:
                      <input type="date" name="dob" value={editForm.dob} onChange={handleInputChange} />
                    </label>

                    <label>
                      Address:
                      <input name="address" value={editForm.address} onChange={handleInputChange} placeholder="Address" />
                    </label>

                    <label>
                      PIN Code:
                      <input name="pin_code" value={editForm.pin_code} onChange={handleInputChange} placeholder="PIN Code" />
                    </label>

                    <label>
                      City:
                      <input name="city" value={editForm.city} onChange={handleInputChange} placeholder="City" />
                    </label>

                    <label>
                      District:
                      <input name="district" value={editForm.district} onChange={handleInputChange} placeholder="District" />
                    </label>

                    <label>
                      State:
                      <input name="state" value={editForm.state} onChange={handleInputChange} placeholder="State" />
                    </label>

                    <label>
                      Country:
                      <input name="country" value={editForm.country} onChange={handleInputChange} placeholder="Country" />
                    </label>

                    <label>
                      Documents Submitted:
                      <input name="documents_submitted" value={editForm.documents_submitted} onChange={handleInputChange} placeholder="Documents Submitted" />
                    </label>

                    <label>
                      Education Qualification:
                      <input name="education_qualification" value={editForm.education_qualification} onChange={handleInputChange} placeholder="Education Qualification" />
                    </label>

                    {/* <label>
          Course:
          <input name="course" value={editForm.course} onChange={handleInputChange} placeholder="Course" />
        </label> */}

                    {/* <label>
          Duration:
          <input name="duration" value={editForm.duration} onChange={handleInputChange} placeholder="Duration" />
        </label> */}

                    {/* <label>
          Exact Fee:
          <input name="exact_fee" type="number" value={editForm.exact_fee} onChange={handleInputChange} placeholder="Exact Fee" />
        </label>

        <label>
          Discount:
          <input name="discount" type="number" value={editForm.discount} onChange={handleInputChange} placeholder="Discount" />
        </label>

        <label>
          Final Fee:
          <input name="final_fee" type="number" value={editForm.final_fee} onChange={handleInputChange} placeholder="Final Fee" />
        </label> */}

                    <label>
                      Batch Time:
                      <input name="batch_time" value={editForm.batch_time} onChange={handleInputChange} placeholder="Batch Time" />
                    </label>

                    <label>
                      Gender:
                      <select name="gender" value={editForm.gender} onChange={handleInputChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    {/* <label>
          Updated By:
          <input name="updated_by" value={editForm.updated_by} onChange={handleInputChange} placeholder="Updated By" />
        </label> */}

                    <div className="modal-footer">
                      <button type="submit" className="action-btn save-btn">Save</button>
                    </div>
                  </form>
                  <button type="button" className="action-btn cancel-btn" onClick={() => setShowEditModal(false)}>X</button>
                </div>
              </div>
            )}



            {/* Start Batch Modal */}
            {showModal && (
              <div className="batch-modal-overlay">
                <div className="batch-modal-content">
                  <h3>Start Batch</h3>
                  <label>
                    Starting Date:
                    <input
                      type="date"
                      value={startingDate}
                      onChange={(e) => setStartingDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Period (days between installments):
                    <input
                      type="number"
                      value={periodDays}
                      onChange={(e) => setPeriodDays(e.target.value)}
                    />
                  </label>
                  <div className="modal-actions">
                    <button onClick={handleStartBatch}>OK</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {/* Modal Popup */}
            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-container">
                  <h3>Confirm Payment</h3>
                  <p>Are you sure you want to update the admission fee payment?</p>
                  {responseMessage && <p className={`modal-message ${isSuccess ? "success-message" : "error-message"}`}>{responseMessage}</p>}

                  {!isSuccess ? (
                    <>
                      <label className="fee-form-label">Payment Method</label>
                      <select
                        className="fee-form-input"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="bank">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        {/* <option value="CHEQUE">Cheque</option> */}
                        <option value="upi">UPI</option>
                        {/* <option value="OTHER">Other</option> */}
                      </select>
                      <button className="confirm-btn" onClick={submitPayment} disabled={isLoading}>
                        {isLoading ? "Processing..." : "Confirm"}
                      </button>
                      <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </>
                  ) : (
                    <div>
                      <button className="receipt-btn" onClick={() => ReceiptPrint({
                        name: selectedStudent.name,
                        course: selectedStudent.course,
                        receipt_no: receipt.bill_number,
                        amount: 1000,
                        timpstamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
                        user: user.name,
                        category: "ADMISSION FEE"
                      })}>
                        Download Receipt
                      </button>
                      <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                        Close
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {tranpop && (
        <div className="transpop-overlay">
          <div className="transpop-content">
            <h2>Transactions</h2>
            <button className="transpop-close-btn" onClick={() => setTranpop(false)}>×</button>
            <table className="transpop-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Bill Number</th>
                  <th>Current Balance</th>
                  <th>Remark</th>
                  <th>Updated By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.transaction_id}</td>
                    <td>{parseFloat(transaction.amount).toLocaleString()}</td>
                    <td>
                      <span className={`transpop-status ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.category}</td>
                    <td>{transaction.bill_number}</td>
                    <td>{parseFloat(transaction.current_balance).toLocaleString()}</td>
                    <td>{transaction.remark}</td>
                    <td>{transaction.updated_by}</td>
                    <td>{transaction.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <button className="transpop-close-btn" onClick={() => setTranpop(false)}>Close</button> */}
          </div>
        </div>
      )}
    </div>
  );
};


export default StudentsPage;