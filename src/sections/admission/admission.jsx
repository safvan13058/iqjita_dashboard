import React, { useState, useEffect } from "react";
import "./admission.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
const AdmissionForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [step, setStep] = useState(() => {
        return parseInt(localStorage.getItem("admissionStep")) || 1;
    });

    const [studentData, setStudentData] = useState(() => {
        return JSON.parse(localStorage.getItem("studentData")) || {
            name: "", location: "", contact_number: "", parent_contact: "", email: "",
            course: "", duration: "", exact_fee: "", discount: 0, final_fee: "", batch_time: "",
            address: "", pin_code: "", city: "", district: "", state: "", country: "",
            documents_submitted: [], education_qualification: "", updated_by: "admin"
        };
    });

    const [feeData, setFeeData] = useState(() => {
        return JSON.parse(localStorage.getItem("feeData")) || {
            admission_number: "", course: "", final_fee
                : "", name: "", contact_number: ""
        };
    });

    const [receipt, setReceipt] = useState(() => {
        return JSON.parse(localStorage.getItem("receipt")) || null;
    });

    // const courseOptions = {
    //     "Computer Science": 50000,
    //     "Business Administration": 45000,
    //     "Mechanical Engineering": 55000,
    //     "Graphic Design": 30000
    // };
    // Course Data in JSON format
    const courseOptions = [
        { name: "Computer Science", exact_fee: 50000, duration: "4 Years" },
        { name: "Business Administration", exact_fee: 45000, duration: "3 Years" },
        { name: "Mechanical Engineering", exact_fee: 55000, duration: "4 Years" },
        { name: "Graphic Design", exact_fee: 30000, duration: "2 Years" }
    ];

    useEffect(() => {
        localStorage.setItem("admissionStep", step);
    }, [step]);

    useEffect(() => {
        localStorage.setItem("studentData", JSON.stringify(studentData));
    }, [studentData]);

    useEffect(() => {
        localStorage.setItem("feeData", JSON.stringify(feeData));
    }, [feeData]);

    useEffect(() => {
        localStorage.setItem("receipt", JSON.stringify(receipt));
    }, [receipt]);
    const resetAdmission = () => {
        localStorage.removeItem("admissionStep");
        localStorage.removeItem("studentData");
        localStorage.removeItem("feeData");
        localStorage.removeItem("receipt");

        setStep(1);
        setStudentData({
            name: "", location: "", contact_number: "", parent_contact: "", email: "",
            course: "", duration: "", exact_fee: "", discount: 0, final_fee: "", batch_time: "",
            address: "", pin_code: "", city: "", district: "", state: "", country: "",
            documents_submitted: [], education_qualification: "",
        });
        setFeeData({
            admission_number: "", course: "", final_fee: "", name: "", contact_number: ""
        });
        setReceipt(null);
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedForm = { ...studentData, [name]: value };

        // Auto-fill exact_fee when a course is selected
        // Auto-fill exact_fee and duration when a course is selected
        if (name === "course") {
            const selectedCourse = courseOptions.find(course => course.name === value);
            updatedForm.exact_fee = selectedCourse ? selectedCourse.exact_fee : "";
            updatedForm.duration = selectedCourse ? selectedCourse.duration : "";
            updatedForm.final_fee = updatedForm.exact_fee - (updatedForm.discount || 0);
        }

        // Auto-calculate final_fee when discount is entered
        if (name === "discount") {
            updatedForm.final_fee = (studentData.exact_fee || 0) - value;
        }

        setStudentData(updatedForm);
    };

    const handleFeeChange = (e) => {
        const { name, value } = e.target;
        setFeeData((prevData) => ({ ...prevData, [name]: value }));
    };
    const isStudentDataComplete = () => {
        return Object.entries(studentData).every(([key, value]) => {
            if (key === "discount" || key === "documents_submitted") {
                return true; // ✅ Ignore `discount` and allow `documents_submitted` to be null
            }
    
            if (Array.isArray(value)) {
                return value.length > 0; // Ensure arrays are not empty
            }
    
            return value !== "" && value !== null; // Ensure all other fields are filled
        });
    };
    


    // Step 1: Submit Student Admission
    const handleSubmitStudent = async (e) => {
        // e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate before sending request
        if (!isStudentDataComplete()) {
            setError("Please fill all required fields before submitting.");
            setLoading(false);
            return;
        }


        // ✅ Add "updated_by" field dynamically
        const updatedStudentData = {
            ...studentData,
            updated_by: "Admin" // Change this value based on the user role
        };

        try {
            const response = await fetch("https://software.iqjita.com/administration.php?action=admission", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedStudentData)
            });

            const text = await response.text(); // Read raw response
            console.log("🔍 Raw API Response:", text); // Debugging log

            // Extract only the second JSON object (if multiple exist)
            const jsonObjects = text.trim().split("\n"); // Split by newline
            const lastJson = jsonObjects.pop(); // Get last valid JSON object

            let result;
            try {
                result = JSON.parse(lastJson);
            } catch (error) {
                throw new Error("❌ Invalid JSON response from server:\n" + text);
            }

            if (response.ok) {
                console.log("✅ Parsed API Response:", result); // Debugging log
                setFeeData({
                    admission_number: result.student_id,
                    course: studentData.course,
                    final_fee: studentData.final_fee,
                    name: studentData.name,
                    course: studentData.course,
                    contact_number: studentData.contact_number
                });
                setStep(3);
            } else {
                setError(result.message || "❌ Failed to submit admission.");
            }
        } catch (error) {
            console.error("🚨 Error submitting admission:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };




    // Step 2: Submit Admission Fee
    const handleSubmitFee = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://software.iqjita.com/administration.php?action=admission_fee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feeData)
            });

            const text = await response.text(); // Read raw response
            console.log("🔍 Raw API Response:", text); // Debugging log

            // Extract only the second JSON object (if multiple exist)
            const jsonObjects = text.trim().split("\n"); // Split response by newline
            const lastJson = jsonObjects.pop(); // Get the last valid JSON object

            let result;
            try {
                result = JSON.parse(lastJson);
            } catch (error) {
                throw new Error("❌ Invalid JSON response from server:\n" + text);
            }

            if (response.ok) {
                console.log("✅ Parsed API Response:", result); // Debugging log
                setReceipt(result);
                setStep(4);
            } else {
                setError(result.message || "❌ Failed to submit fee details.");
            }
        } catch (error) {
            console.error("🚨 Error submitting fee details:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Input Change
    const handleDocumentsChange = (e) => {
        const selectedDocs = [...e.target.selectedOptions].map(option => option.value);
        setStudentData(prevData => ({
            ...prevData,
            documents_submitted: selectedDocs // ✅ Always stores an array
        }));
    };



    return (
        <div className="container">
            {/* <h2>Student Admission Process</h2> */}

            {/* Display Error Message */}
            {error && <p className="error">{error}</p>}

            {/* Step Progress Bar with Horizontal Line */}
            <div className="step-container">
                <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
                <div className={`line ${step >= 2 ? "active-line" : ""}`}>Register</div>

                <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
                <div className={`line ${step >= 3 ? "active-line" : ""}`}>Preview</div>

                <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
                <div className={`line ${step === 4 ? "active-line" : ""}`}>Fee Payment</div>

                <div className={`step ${step === 4 ? "active" : ""}`}>4</div>
            </div>


            {/* Step 1: Student Admission Form */}
            {step === 1 && (
                <form className="form-container">
                    <h3>Step 1: Register Student</h3>
                    <div className="form-row">

                        {/* Left Side: Personal Details */}
                        <div className="form-column">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Full Name"
                                value={studentData.name || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Enter Location"
                                value={studentData.location || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Contact Number</label>
                            <input
                                type="text"
                                name="contact_number"
                                placeholder="Enter Contact Number"
                                value={studentData.contact_number || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Parent Contact</label>
                            <input
                                type="text"
                                name="parent_contact"
                                placeholder="Enter Parent Contact"
                                value={studentData.parent_contact || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={studentData.email || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter Address"
                                value={studentData.address || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Pin Code</label>
                            <input
                                type="text"
                                name="pin_code"
                                placeholder="Enter Pin Code"
                                value={studentData.pin_code || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Enter City"
                                value={studentData.city || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>District</label>
                            <input
                                type="text"
                                name="district"
                                placeholder="Enter District"
                                value={studentData.district || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                placeholder="Enter State"
                                value={studentData.state || ""}
                                onChange={handleChange}
                                required
                            />

                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Enter Country"
                                value={studentData.country || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Right Side: Course Details */}
                        <div className="form-column">
                            <label>Course</label>
                            <select name="course" value={studentData.course} onChange={handleChange} required>
                                <option value="">Select Course</option>
                                {courseOptions.map((course) => (
                                    <option key={course.name} value={course.name}>{course.name}</option>
                                ))}
                            </select>

                            <label>Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={studentData.duration || ""}
                                readOnly
                            />

                            <label>Exact Fee</label>
                            <input
                                type="number"
                                name="exact_fee"
                                value={studentData.exact_fee || ""}
                                readOnly
                            />

                            <label>Discount</label>
                            <input
                                type=""
                                name="discount"
                                placeholder="Enter Discount"
                                value={studentData.discount || ""}
                                onChange={handleChange}
                            />

                            <label>Final Fee</label>
                            <input
                                type="number"
                                name="final_fee"
                                value={studentData.final_fee || ""}
                                readOnly
                            />

                            <label>Batch Time</label>
                            <select name="batch_time" value={studentData.batch_time} onChange={handleChange} required>
                                <option value="">Select Batch Time</option>
                                <option value="9 AM - 11 AM">9 AM - 11 AM</option>
                                <option value="10 AM - 12 PM">10 AM - 12 PM</option>
                                <option value="1 PM - 3 PM">1 PM - 3 PM</option>
                            </select>

                            <label>Documents Submitted</label>
                            <select multiple value={studentData.documents_submitted} onChange={handleDocumentsChange}>
                                <option value="ID Proof">ID Proof</option>
                                <option value="Birth Certificate">Birth Certificate</option>
                                <option value="Education Certificates">Education Certificates</option>
                                <option value="Passport">Passport</option>
                            </select>

                            {/* Show Selected Documents */}
                            {studentData.documents_submitted.length > 0 && (
                                <p><strong>Selected Documents:</strong> {studentData.documents_submitted.join(", ")}</p>
                            )}

                            <label>Education Qualification</label>
                            <select name="education_qualification" value={studentData.education_qualification} onChange={handleChange} required>
                                <option value="">Select Qualification</option>
                                <option value="High School">High School</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Postgraduate">Postgraduate</option>
                            </select>
                        </div>
                    </div>
                    <div className="btn-grp">
                        <div>
                            <button type="button" onClick={resetAdmission}>Clear</button>
                            <button type="button" onClick={() => navigate("/")}>Home</button>
                        </div>
                        <button type="button" onClick={() => setStep(2)}>Next: Submit Admission</button>
                    </div>
                </form>
            )}

            {step === 2 && (
                <div className="preview-container">
                    <h3>Step 2: Review & Confirm Admission Details</h3>

                    <div className="preview-grid">
                        {/* Left Side: Personal Details */}
                        <div className="preview-column">
                            <h4>Personal Details</h4>
                            <p><strong>Full Name:</strong> {studentData.name}</p>
                            <p><strong>Contact Number:</strong> {studentData.contact_number}</p>
                            <p><strong>Email:</strong> {studentData.email}</p>
                            <p><strong>Address:</strong> {studentData.address}, {studentData.city}, {studentData.state} - {studentData.pin_code}, {studentData.country}</p>
                            <p><strong>Parent Contact:</strong> {studentData.parent_contact}</p>
                            <p><strong>Education Qualification:</strong> {studentData.education_qualification}</p>
                        </div>

                        {/* Right Side: Course & Fee Details */}
                        <div className="preview-column">
                            <h4>Course & Fee Details</h4>
                            <p><strong>Course:</strong> {studentData.course}</p>
                            <p><strong>Duration:</strong> {studentData.duration}</p>
                            <p><strong>Batch Time:</strong> {studentData.batch_time}</p>
                            <p><strong>Documents Submitted:</strong> {studentData.documents_submitted?.join(", ") || "None"}</p>
                            <p><strong>Exact Fee:</strong> {studentData.exact_fee}</p>
                            <p><strong>Discount:</strong> {studentData.discount}</p>
                            <p><strong>Final Fee:</strong> {studentData.final_fee}</p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="button-group">
                        <button onClick={() => setStep(1)}>⬅ Edit Details</button>
                        <button onClick={() => handleSubmitStudent()}>Next: Proceed to Payment ➡</button>
                    </div>
                </div>
            )}


            {/* Step 3: Admission Fee Form */}
            {
                step === 3 && (
                    <form onSubmit={handleSubmitFee}>
                        <h3>Step 2: Submit Admission Fee</h3>

                        <label>Admission Number</label>
                        <input type="text" name="admission_number" value={feeData.admission_number} readOnly />

                        <label>Student Name</label>
                        <input type="text" name="name" value={feeData.name} readOnly />

                        <label>Contact Number</label>
                        <input type="text" name="contact_number" value={feeData.contact_number} readOnly />

                        <label>Course</label>
                        <input type="text" name="course" value={feeData.course} readOnly />

                        <label>Final Fee</label>
                        <input
                            type="number"
                            name="exact_fee"
                            value={feeData.final_fee}
                            // onChange={(e) => setFeeData({ ...feeData, exact_fee: e.target.value })}
                            required
                        />
                        <div className="btn-grp">
                        <button type="button" onClick={() => setStep(2)}>Back</button>
                        <button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Next: Generate Receipt"}
                        </button>
                        </div>
                    </form>

                )
            }

            {/* Step 4: Receipt */}
            {step === 4 && receipt && (
                <div className="receipt-container">
                    <h3>Step 4: Payment Receipt</h3>

                    <div className="receipt-box">
                        <p><strong>Name:</strong> {studentData.name}</p>
                        <p><strong>Course:</strong> {studentData.course}</p>
                        <p><strong>Receipt Number:</strong> {receipt.receipt_no || `R-${receipt.admission_number}`}</p>
                        <p><strong>Admission Number:</strong> {receipt.admission_number}</p>
                        {/* <p><strong>Message:</strong> {receipt.message}</p> */}
                    </div>

                    <button onClick={() => window.print()}>🖨 Print Receipt</button>
                    <button onClick={resetAdmission}>Start New Admission</button>

                </div>
            )}
        </div >
    );
};

export default AdmissionForm;
