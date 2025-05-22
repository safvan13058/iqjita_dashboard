import React, { useState, useEffect } from "react";
import "./admission.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { format } from 'date-fns';

import { Country, State, City } from "country-state-city";
const AdmissionForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [discountData, setDiscountData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseOptions, setCourseOptions] = useState([]);
    const [discountcal, setdiscountcal] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(() => {
    return localStorage.getItem("selectedCountry") || "";
});

const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem("selectedState") || "";
});

    const [selectedCity, setSelectedCity] = useState("");
    const [studentsalldata, setstudentsall] = useState("");
    const [step, setStep] = useState(() => {
        return parseInt(localStorage.getItem("admissionStep")) || 1;
    });
    const user = JSON.parse(localStorage.getItem('user'));
    const ReceiptPrint = (Receipt) => {
        // Store student data in localStorage
        localStorage.setItem("Receiptdata", JSON.stringify(Receipt));

        // Open the new print page
        window.open("/recipts/billreceipt.html", "_blank");
    };
    const handlePrint = (student) => {
        // Store student data in localStorage
        console.log("admission form", student)
        const students = student.student;
        const course = student.course_details;

        const fullStudentData = [{
            status: student.status,
            message: student.message,
            student_id: student.student_id,
            photo: student.photo,
            name: students.name,
            dob: students.dob,
            gender: students.gender,
            email: students.email,
            contact_number: students.contact_number,
            parent_contact: students.parent_contact,
            address: students.address,
            location: students.location,
            city: students.city,
            district: students.district,
            state: students.state,
            country: students.country,
            pin_code: students.pin_code,
            education_qualification: students.education_qualification,
            documents_submitted: students.documents_submitted,
            course: students.course,
            duration: students.duration,
            exact_fee: students.exact_fee,
            admission_fee: course.admission_fee,
            discount: students.discount,
            final_fee: students.final_fee,
            batch_time: students.batch_time,
            branch: students.branch,
            updated_by: students.updated_by,
            course_details: {
                id: course.id,
                course: course.course,
                duration: course.duration,
                exact_fee: course.exact_fee,
                admission_fee: course.admission_fee,
                discount: course.discount,
                install1: course.install1,
                install2: course.install2,
                install3: course.install3,
                install4: course.install4,
                install5: course.install5,


            }
        }];

        localStorage.setItem("selectedStudentdata", JSON.stringify(fullStudentData));

        // setstudentsall
        // Open the new print page
        window.open("/recipts/studentdata.html", "_blank");

    };
    const [studentData, setStudentData] = useState(() => {
        return JSON.parse(localStorage.getItem("studentData")) || {
            name: "", location: "", contact_number: "", parent_contact: "", email: "",
            course: "", duration: "", exact_fee: "", discount: 0, final_fee: "", batch_time: "",
            address: "", pin_code: "", city: "", district: "", state: "", country: "",
            documents_submitted: [], education_qualification: "", updated_by: user.name, dob: "",
            branch: 1, photo: null, photoPreview: null, gender: '', referredby: '', referredbycategory: ''
        };
    });

    const [feeData, setFeeData] = useState(() => {
        return JSON.parse(localStorage.getItem("feeData")) || {
            admission_number: "", course: "", final_fee: "", name: "", contact_number: "", payment_method: ""
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
    // const courseOptions = [
    //     { name: "Computer Science", exact_fee: 50000, duration: "4 Years" },
    //     { name: "Business Administration", exact_fee: 45000, duration: "3 Years" },
    //     { name: "Mechanical Engineering", exact_fee: 55000, duration: "4 Years" },
    //     { name: "Graphic Design", exact_fee: 30000, duration: "2 Years" }
    // ];

    const fetchCourseOptions = async () => {
        try {
            const response = await fetch("https://software.iqjita.com/administration.php?action=getcoursedetails");

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const text = await response.text(); // Read raw response
            console.log("Raw Response:", text); // Debugging: check raw response


            // Trim extra characters and safely parse JSON
            const jsonStartIndex = text.indexOf("{"); // Find first "{"
            const cleanJson = jsonStartIndex !== -1 ? text.slice(jsonStartIndex).trim() : text;

            let data;
            try {
                data = JSON.parse(cleanJson);
            } catch (jsonError) {
                throw new Error("Failed to parse JSON: " + jsonError.message);
            }

            console.log("Parsed Data:", data);

            if (data.status === "success") {
                const formattedCourses = data.courses.map(course => ({
                    name: course.course,
                    exact_fee: parseFloat(course.exact_fee), // Convert fee to number
                    duration: course.duration
                }));

                console.log("✅ Transformed Course Options:", formattedCourses);
                setCourseOptions(formattedCourses); // Update state
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
            documents_submitted: [], education_qualification: "", dob: "", photo: null, photoPreview: null, gender: '', referredby: '', referredbycategory: ''
        });
        setFeeData({
            admission_number: "", course: "", final_fee: "", name: "", contact_number: ""
        });
        setReceipt(null);
        setError(null);
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
   const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = Country.getAllCountries().find((c) => c.isoCode === countryCode);
    
    setSelectedCountry(countryCode);
    setSelectedState("");
    setSelectedCity("");

    // Save to localStorage
    localStorage.setItem("selectedCountry", countryCode);
    localStorage.removeItem("selectedState"); // Clear dependent state

    setStudentData((prev) => ({
        ...prev,
        country: country ? country.name : "",
        state: "",
        city: "",
        district: "",
    }));
};
useEffect(() => {
    const country = Country.getAllCountries().find((c) => c.isoCode === selectedCountry);
    const state = State.getStatesOfCountry(selectedCountry).find((s) => s.isoCode === selectedState);

    setStudentData((prev) => ({
        ...prev,
        country: country ? country.name : "",
        state: state ? state.name : "",
    }));
}, [selectedCountry, selectedState]);

const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const state = State.getStatesOfCountry(selectedCountry).find((s) => s.isoCode === stateCode);

    setSelectedState(stateCode);

    // Save to localStorage
    localStorage.setItem("selectedState", stateCode);

    setSelectedCity("");
    setStudentData((prev) => ({
        ...prev,
        state: state ? state.name : "",
        city: "",
        district: "",
    }));
};


    // Handle city selection
    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setStudentData((prev) => ({
            ...prev,
            city: e.target.value,
        }));
    };

    const handleFeeChange = (e) => {
        const { name, value } = e.target;
        setFeeData((prevData) => ({ ...prevData, [name]: value }));
    };
    const isStudentDataComplete = () => {
        return Object.entries(studentData).every(([key, value]) => {
            if (["discount", "documents_submitted", "photo", "photoPreview", "referredby", "referredbycategory"].includes(key)) {
                return true; // ✅ Explicitly allow null for these fields
            }

            if (Array.isArray(value)) {
                return value.length > 0; // Ensure arrays are not empty
            }

            return value !== "" && value !== null; // Ensure all other fields are filled
        });
    };


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setStudentData((prev) => ({ ...prev, photo: file, photoPreview: previewURL }));
        }
    };


    // Step 1: Submit Student Admission
    const handleSubmitStudent = async (e) => {
        // e.preventDefault();
        setLoading(true);
        setError(null);

        console.log("studentdata==", studentData)

        // Validate before sending request
        if (!isStudentDataComplete()) {
            setError("Please fill all required fields before submitting.");
            setLoading(false);
            return;
        }


        // ✅ Add "updated_by" field dynamically
        const updatedStudentData = {
            ...studentData,
            documents_submitted: Array.isArray(studentData.documents_submitted)
                ? studentData.documents_submitted.join(", ")  // Convert array to string
                : studentData.documents_submitted,  // If already a string, use as is
            updated_by: user.name // Change this value based on the user role
        };
        const formData = new FormData();
        formData.append("name", updatedStudentData.name);
        formData.append("location", updatedStudentData.location);
        formData.append("contact_number", updatedStudentData.contact_number);
        formData.append("parent_contact", updatedStudentData.parent_contact);
        formData.append("email", updatedStudentData.email);
        formData.append("dob", updatedStudentData.dob);
        formData.append("course", updatedStudentData.course);
        formData.append("duration", updatedStudentData.duration);
        formData.append("exact_fee", updatedStudentData.exact_fee);
        formData.append("discount", updatedStudentData.discount);
        formData.append("final_fee", updatedStudentData.final_fee);
        formData.append("batch_time", updatedStudentData.batch_time);
        formData.append("address", updatedStudentData.address);
        formData.append("pin_code", updatedStudentData.pin_code);
        formData.append("city", updatedStudentData.city);
        formData.append("district", updatedStudentData.district);
        formData.append("state", updatedStudentData.state);
        formData.append("country", updatedStudentData.country);
        formData.append("documents_submitted", updatedStudentData.documents_submitted);
        formData.append("gender", updatedStudentData.gender);
        formData.append("education_qualification", updatedStudentData.education_qualification);
        formData.append("updated_by", updatedStudentData.updated_by);
        formData.append("branch", updatedStudentData.branch);
        formData.append("referredby", updatedStudentData.referredby);
        formData.append("referredbycategory", updatedStudentData.referredbycategory);

        // File input (make sure it's from an <input type="file" /> or similar)
        if (updatedStudentData.photo instanceof File) {
            formData.append("photo", updatedStudentData.photo);
        }



        console.log("correct", updatedStudentData)
        try {
            const response = await fetch("https://software.iqjita.com/admission.php", {
                method: "POST",
                body: formData,
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
                throw new Error("❌ Invalid JSON response from server:\n");
            }
            if (result.status === "success") {
                console.log("✅ Parsed API Response:", result); // Debugging log
                setFeeData({
                    admission_number: result.student_id,
                    course: studentData.course,
                    final_fee: studentData.final_fee,
                    name: studentData.name,
                    course: studentData.course,
                    contact_number: studentData.contact_number
                });
                setstudentsall(result)
                setStep(3);
            } else {
                setError(result.error || "❌ Failed to submit admission.");
            }
        } catch (error) {
            console.error("🚨 Error submitting admission:", error);
            setError(error.error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitFee = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://software.iqjita.com/administration.php?action=admission_fee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feeData),
            });

            const text = await response.text();
            console.log("🔍 Raw API Response:", text); // Debugging log

            let result;
            try {
                result = JSON.parse(text); // Parse response correctly
            } catch (error) {
                throw new Error("❌ Invalid JSON response from server:\n" + text);
            }

            if (response.ok && result.status === "success") {
                console.log("✅ Parsed API Response:", result); // Debugging log
                // setReceipt(result);
                setStep(4);

                // Proceed with transaction API call
                const transactionResponse = await fetch("https://software.iqjita.com/administration.php?action=transaction", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: 1000,
                        type: "credit",
                        category: "Admission",
                        payment_method: feeData.payment_method,
                        remark: feeData.admission_number || "N/A",
                        updated_by: user.name,
                    }),
                });

                const transactionText = await transactionResponse.text();
                console.log("🔍 Transaction API Response:", transactionText); // Debugging log

                let transactionResult;
                try {
                    transactionResult = JSON.parse(transactionText);
                } catch (error) {
                    throw new Error("❌ Invalid JSON response from transaction API:\n" + transactionText);
                }

                if (transactionResponse.ok && transactionResult.status === "success") {
                    console.log("✅ Transaction Successful:", transactionResult);
                    // Merge bill_number into result and update receipt
                    const updatedReceipt = {
                        ...result,
                        bill_number: transactionResult.bill_number
                    };

                    setReceipt(updatedReceipt);

                    alert(transactionResult.message);
                } else {
                    console.error("❌ Transaction Failed:", transactionResult);
                    alert(transactionResult.message || "Transaction failed.");
                }
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


    const handleCalculate = async () => {
        setLoading(true);
        setDiscountData(null); // Clear previous results

        try {
            const response = await fetch("https://software.iqjita.com/administration.php?action=discount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseFee: parseFloat(studentData.exact_fee) || 0,
                    offerPrice: parseFloat(discountcal.offerPrice) || 0,
                    groupDiscountPercentage: parseFloat(discountcal.groupDiscountPercentage) || 0,
                    oneTimePaymentDiscountPercentage: parseFloat(discountcal.oneTimePaymentDiscountPercentage) || 0,
                }),
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
                throw new Error("❌ Invalid JSON response from server:\n");
            }

            if (response.ok && result.status === "success" && result.finalPrice !== undefined) {
                console.log("✅ Parsed API Response:", result); // Debugging log
                setDiscountData(result);
                setStudentData((prev) => ({
                    ...prev,
                    discount: result.totalDiscountAmount,
                    final_fee: result.finalPrice
                }));


            } else {
                alert("Error calculating discount: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error fetching discount:", error);
            alert("Failed to fetch discount. Please try again.");
        }

        setLoading(false);
    };


    // Handle Input Change
    const handleDocumentsChange = (e) => {
        const selectedDocs = [...e.target.selectedOptions].map(option => option.value);
        setStudentData(prevData => ({
            ...prevData,
            documents_submitted: selectedDocs // ✅ Always stores an array
        }));
    };

    const handlediscount = (e) => {
        const { name, value } = e.target;
        setdiscountcal((prev) => ({
            ...prev,
            [name]: value, // Update the specific field in the state
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
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={studentData.dob || ""}
                                onChange={handleChange}
                                // max={new Date().toISOString().split("T")[0]} // Restricts future dates
                                required
                            />
                            <label>Gender</label>
                            <div className="gender-ratio">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={studentData.gender === "male"}
                                    onChange={handleChange}
                                    required
                                />
                                <label>Male</label>

                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={studentData.gender === "female"}
                                    onChange={handleChange}
                                    required
                                />
                                <label>Female</label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="others"
                                    checked={studentData.gender === "others"}
                                    onChange={handleChange}
                                    required
                                />
                                <label>Others</label>
                            </div>



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
                            {/* <input
                                type="tel"
                                name="contact_number"
                                placeholder="Enter Contact Number"
                                value={studentData.contact_number || ""}
                                onChange={handleChange}
                                required
                            /> */}
                            <PhoneInput
                                country={"in"} // Default country (India)
                                value={studentData.contact_number || ""}
                                placeholder="Enter Contact Number"
                                onChange={(phone) =>
                                    setStudentData((prev) => ({
                                        ...prev,
                                        contact_number: phone, // Directly store the phone number
                                    }))
                                }
                                inputProps={{
                                    name: "contact_number",
                                    // required: true,
                                }}
                                containerStyle={{ width: "100%" }}
                                inputStyle={{ width: "100%", paddingLeft: "50px" }}
                            />

                            <div className="addission-pic">
                                <div className="pic-input">
                                    <label>Photo</label>
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        // placeholder="Enter Contact Number"
                                        // value={studentData.photo || ""}
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                                {studentData.photoPreview && (
                                    <div className="Preview-pic">
                                        <img
                                            src={studentData.photoPreview}
                                            alt="Preview"
                                            style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ccc" }}
                                        />
                                    </div>
                                )}
                            </div>

                            <label>Parent Contact</label>
                            {/* <input
                                type="tel"
                                name="parent_contact"
                                placeholder="Enter Parent Contact"
                                value={studentData.parent_contact || ""}
                                onChange={handleChange}
                                required
                            /> */}
                            <PhoneInput
                                country={"in"} // Default country (India)
                                value={studentData.parent_contact || ""}
                                placeholder="Enter Parent Contact"
                                onChange={(phone) =>
                                    setStudentData((prev) => ({
                                        ...prev,
                                        parent_contact: phone, // Directly store the phone number
                                    }))
                                }
                                inputProps={{
                                    name: "parent_contact",
                                    // required: true,
                                }}
                                containerStyle={{ width: "100%" }}
                                inputStyle={{ width: "100%", paddingLeft: "50px" }}
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

                            {/* Country Selection */}
                            <label>Country</label>
                            <select value={selectedCountry} onChange={handleCountryChange}>
                                <option value="">Select Country</option>
                                {Country.getAllCountries().map((c) => (
                                    <option key={c.isoCode} value={c.isoCode}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {/* State Selection */}
                            <label>State</label>
                            <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
                                <option value="">Select State</option>
                                {selectedCountry &&
                                    State.getStatesOfCountry(selectedCountry).map((s) => (
                                        <option key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </option>
                                    ))}
                            </select>
                            {/* District Selection
                            <label>District</label>
                            <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedState}>
                                <option value="">Select District</option>
                                {selectedState &&
                                    getDistricts(selectedState).map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                            </select>

                            {/* City Selection */}
                            {/* <label>City</label>
                            <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
                                <option value="">Select City</option>
                                {selectedState &&
                                    City.getCitiesOfState(selectedCountry, selectedState).map((c) => (
                                        <option key={c.name} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select> */}

                            {/* <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Enter Country"
                                value={studentData.country || ""}
                                onChange={handleChange}
                                required
                            /> */}
                            {/* <label>State</label>
                            <input
                                type="text"
                                name="state"
                                placeholder="Enter State"
                                value={studentData.state || ""}
                                onChange={handleChange}
                                required
                            />}*/}
                            <label>District</label>
                            <input
                                type="text"
                                name="district"
                                placeholder="Enter District"
                                value={studentData.district || ""}
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
                        </div>

                        {/* Right Side: Course Details */}
                        <div className="form-column">
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
                            <div className="discountinput">
                                <div>
                                    <label>Discount</label>
                                    <input
                                        type=""
                                        name="discount"
                                        placeholder="Enter Discount"
                                        value={studentData.discount || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="adm-btn-grp">

                                    <button type="button" onClick={() => setShowPopup(true)}>
                                        Calculate
                                    </button>

                                    <button type="button" onClick={() => setStudentData((prev) => ({ ...prev, discount: '', final_fee: prev.exact_fee }))}>
                                        Clear
                                    </button>
                                </div>

                            </div>



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
                                <option value="11 AM - 1 PM">11 AM - 1 PM</option>
                                <option value="2 PM - 4 PM">2 PM - 4 PM</option>
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
                            <label>Referred by</label>
                            <input
                                type="text"
                                name="referredby"
                                onChange={handleChange}
                                value={studentData.referredby || ""}
                            // readOnly
                            />
                            <label>Ref category</label>
                            <select name="referredbycategory" value={studentData.referredbycategory} onChange={handleChange} required>
                                <option value="">Ref category</option>
                                <option value="Students">Students</option>
                                <option value="Staff">Staff</option>
                                <option value="Other">Other</option>
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
            )}{showPopup && (
                <div className="home-popup-overlay">
                    <div className="home-popup-content">
                        <h2>Calculate Discount</h2>
                        <button
                            className="close-button"
                            onClick={() => setShowPopup(false)}
                        >
                            ×
                        </button>

                        <div className="popup-discountinputs">
                            <div className="discount-column">
                                <label>Course Fee</label>
                                <input type="number" name="courseFee" value={studentData.exact_fee} readOnly />

                                <label>Group Discount (%)</label>
                                <input type="number" name="groupDiscountPercentage" value={discountcal.groupDiscountPercentage || ""} onChange={handlediscount} />
                            </div>

                            <div className="discount-column">
                                <label>Offer Price</label>
                                <input type="number" name="offerPrice" value={discountcal.offerPrice || ""} onChange={handlediscount} />

                                <label>One-Time Payment Discount (%)</label>
                                <input type="number" name="oneTimePaymentDiscountPercentage" value={discountcal.oneTimePaymentDiscountPercentage || ""} onChange={handlediscount} />
                            </div>

                            <div className="discount-buttons">
                                <button onClick={handleCalculate} disabled={loading}>{loading ? "Calculating..." : "Calculate"}</button>
                                <button onClick={() => setdiscountcal({})}>Clear</button>
                            </div>
                        </div>


                        {discountData && (
                            <div className="discount-results">
                                <h3>Discount Results</h3>
                                <div className="discount-results-para">
                                    <p><strong>Final Price:</strong> {discountData.finalPrice}</p>
                                    <p><strong>Total Discount Amount:</strong> {discountData.totalDiscountAmount}</p>
                                    <p><strong>Group Discount:</strong> {discountData.groupDiscountAmount}</p>
                                    <p><strong>One-Time Payment Discount:</strong> {discountData.oneTimePaymentDiscountAmount}</p>
                                    <p><strong>Offer Price:</strong> {discountData.offerPrice}</p>
                                </div>
                            </div>
                        )}

                        {/* <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button> */}
                    </div>
                </div>
            )}



            {step === 2 && (
                <div className="preview-container">
                    <h3>Step 2: Review & Confirm Admission Details</h3>

                    <div className="preview-grid">
                        {/* Left Side: Personal Details */}
                        <div className="preview-column">
                            <h4>Personal Details</h4>
                            <div>
                                {studentData.photoPreview ? (
                                    <img src={studentData.photoPreview} alt="Uploaded Preview" style={{ width: '100px', height: '120px' }} />
                                ) : (
                                    <p>No image uploaded</p>
                                )}
                            </div>

                            <div>
                                <p style={{ fontSize: '8px' }}>Filename: {studentData.photo?.name || studentData.photo?.filename || 'N/A'}</p>
                            </div>
                            <p><strong>Full Name:</strong> {studentData.name}</p>
                            <p><strong>Date of Birth:</strong> {studentData.dob}</p>
                            <p><strong>Gender:</strong> {studentData.gender}</p>
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
                        <label>Payment Method</label>
                        <select name="type" value={feeData.payment_method}>
                            <option value="cash">CASH</option>
                            <option value="upi">UPI</option>
                            <option value="bank">BANK</option>
                        </select>
                        <div className="btn-grp">
                            <button type="button" onClick={() => setStep(2)}>Back</button>
                            <button type="button" onClick={() => handlePrint(studentsalldata)} disabled={loading}>
                                {loading ? "Processing..." : "Admission form"}
                            </button>
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
                        <p><strong>Receipt Number:</strong> {receipt.bill_number || `R-${receipt.admission_number}`}</p>
                        <p><strong>Admission Number:</strong> {receipt.admission_number}</p>
                        {/* <p><strong>Message:</strong> {receipt.message}</p> */}
                    </div>

                    <button onClick={() => ReceiptPrint({
                        name: studentData.name,
                        course: studentData.course,
                        receipt_no: receipt.bill_number,
                        amount: 1000,
                        timpstamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
                        user: user.name,
                        category: "ADMISSION FEE"

                    })}>🖨 Print Receipt</button>
                    <button onClick={resetAdmission}>Start New Admission</button>

                </div>
            )}
        </div >
    );
};

export default AdmissionForm;
