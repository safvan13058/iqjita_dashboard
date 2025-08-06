import React, { useState, useEffect } from 'react';
import './payroll.css';
import { FaFileDownload, FaPrint, FaWhatsapp, FaSms, FaEnvelope, FaPlusCircle } from "react-icons/fa"
import html2pdf from "html2pdf.js";
import { FaTimes } from 'react-icons/fa';
import { FaFilePdf } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const payrollData = [
  {
    employeeId: 'EMP001',
    name: 'John Doe',
    department: 'Finance',
    designation: 'Manager',
    payDate: '2025-05-14',
    basicSalary: '$5000',
    allowances: '$1000',
    deductions: '$500',
    netPay: '$5500',
  },
  {
    employeeId: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    designation: 'Executive',
    payDate: '2025-05-14',
    basicSalary: '$4000',
    allowances: '$800',
    deductions: '$400',
    netPay: '$4400',
  },
];

const PayrollTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem('user'))
  const [employeeIdSearch, setEmployeeIdSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const getPreviousMonth = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1); // Go to previous month
    return now.toISOString().slice(0, 7); // Format: YYYY-MM
  };
  const getCurrentMonth = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7); // "2025-06"
  };
  const handleMonthFilter = (mode) => {
    const today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    if (mode === "previousMonth") {
      month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
    }

    const formatted = `${year}-${String(month).padStart(2, "0")}`;
    setSelectedMonth(formatted);
  };

  const numberToWords = (num) => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const numToWords = (n) => {
      if ((n = n.toString()).length > 9) return 'Overflow';
      let nStr = ('000000000' + n).substr(-9).match(/.{1,2}/g);
      let str = '';
      str += (nStr[0] != 0) ? (a[Number(nStr[0])] || b[nStr[0][0]] + ' ' + a[nStr[0][1]]) + ' Crore ' : '';
      str += (nStr[1] != 0) ? (a[Number(nStr[1])] || b[nStr[1][0]] + ' ' + a[nStr[1][1]]) + ' Lakh ' : '';
      str += (nStr[2] != 0) ? (a[Number(nStr[2])] || b[nStr[2][0]] + ' ' + a[nStr[2][1]]) + ' Thousand ' : '';
      str += (nStr[3] != 0) ? (a[Number(nStr[3])] || b[nStr[3][0]] + ' ' + a[nStr[3][1]]) + ' Hundred ' : '';
      str += (nStr[4] != 0) ? ((str != '') ? 'and ' : '') +
        (a[Number(nStr[4])] || b[nStr[4][0]] + ' ' + a[nStr[4][1]]) + ' ' : '';
      return str.trim();
    };

    return numToWords(Math.floor(num)) + " Rupees Only";
  };
  const fetchPayrolls = async (month = "", empId = "") => {
    try {
      let url = "https://software.iqjita.com/hr/payroll.php";
      const params = [];
      if (!month) {
        const today = new Date();
        const year = today.getFullYear();
        const mon = String(today.getMonth() + 1).padStart(2, "0"); // JS months are 0-based
        month = `${year}-${mon}`;
      }

      if (month) params.push(`paydate=${month}`);
      if (empId) params.push(`employee_id=${empId}`);

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      console.log("📡 Fetching payrolls from:", url); // 🔍 Debug URL

      const res = await fetch(url);
      console.log("📦 Response Status:", res.status); // ✅/❌ Check response status

      const data = await res.json();
      console.log("📊 Payroll Data Received:", data); // 👀 View full data

      setFilteredData(data);
    } catch (err) {
      console.error("❌ Error fetching payrolls:", err); // Catch and log errors
    }
  };


  useEffect(() => {
    fetchPayrolls(selectedMonth, selectedEmployeeId);
  }, [selectedMonth, selectedEmployeeId]);

  const filteredDatas = payrollData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (payroll) => {
    setSelectedPayroll(payroll);
  };

  const closeModal = () => {
    setSelectedPayroll(null);
  };
  const handleSavePayroll = (updatedPayroll) => {
    // Here, update your backend or state
    console.log("Saving payroll:", updatedPayroll);
    closeModal(); // Close after save
  };

  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [calculation, setcalculation] = useState([])
  const [status, setStatus] = useState(""); // "processing", "success", "error"
  const [lastPayroll, setLastPayroll] = useState(null); // Store last response

  const [employeeData, setEmployeeData] = useState({
    name: "",
    department: "",
    designation: "",
    baseSalary: ""
  });
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    department: "",
    designation: "",
    numLeaves: 0,
    earlyOut: 0,
    lateComing: 0,
    reducingAmount: 0,
    allowances: 0,
    leaveCompensation: 1,
    baseSalary: 0,
    totalSalary: 0,
    payDate: today,
    updatedBy: user.name, // Or use logged-in user's name
    payment_method: "bank",
    salarymonth: getPreviousMonth()
  });

  const calculateTotalSalary = ({
    numLeaves,
    earlyOut,
    lateComing,
    reducingAmount,
    leaveCompensation,
    allowances,
    baseSalary,
  }) => {
    const oneDaySalary = baseSalary / 30;
    const totalLateEarly = lateComing + earlyOut;

    // Deduct 0.5 day for every 2 late/early, starting from 2 (not ignoring any)
    const halfDays = Math.floor(totalLateEarly / 2) * 0.5;

    const lateEarlyDeduction = parseFloat((oneDaySalary * halfDays).toFixed(2));


    // Leave deduction: 1st leave is compensated
    const leaveDeduction = parseFloat(
      (Math.max(numLeaves - 1, 0) * oneDaySalary).toFixed(2)
    );


    // Leave compensation: default to 1 day if not given
    const effectiveLeaveCompensation =
      leaveCompensation > 0 ? leaveCompensation : numLeaves > 0 ? oneDaySalary : 0;

    let totalSalary =
      baseSalary - leaveDeduction - lateEarlyDeduction - reducingAmount + allowances;

    totalSalary = Math.round(totalSalary);

    // return totalSalary >= 0 ? Math.round(totalSalary) : 0;
    return {
      baseSalary,
      leaveDeduction,
      lateEarlyDeduction,
      reducingAmount,
      effectiveLeaveCompensation,
      allowances,
      totalSalary,
    };
  };

  // const handleDownloadPDF = () => {
  //   if (!reportData) return;

  //   const doc = new jsPDF({
  //     orientation: 'portrait',
  //     unit: 'mm',
  //     format: 'a4'
  //   });

  //   // Title
  //   doc.setFontSize(18);
  //   doc.setTextColor(33, 33, 33);
  //   doc.text(`Salary Report`, 105, 20, { align: 'center' });

  //   doc.setFontSize(12);
  //   doc.text(`Month: ${selectedMonth}`, 105, 28, { align: 'center' });
  //   doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 34, { align: 'center' });

  //   let finalY = 40;

  //   // Employees WITH Bank Details
  //   doc.setFontSize(14);
  //   doc.text('Employees WITH Bank Details', 14, finalY);

  //   autoTable(doc, {
  //     startY: finalY + 4,
  //     head: [['Emp ID', 'Name', 'Phone', 'Account Number', 'Total Salary']],
  //     body: reportData.with_bank_details.map(emp => [
  //       emp.EmployeeID,
  //       emp.FullName,
  //       emp.PhoneNumber,
  //       emp.AccountNumber,
  //       `Rs.${parseFloat(emp.TotalSalary).toFixed(2)}/-`
  //     ]),
  //     styles: { fontSize: 9 },
  //     headStyles: {
  //       fillColor: [14, 14, 35], // Deep navy
  //       textColor: [255, 255, 255]
  //     },
  //     alternateRowStyles: { fillColor: [240, 240, 240] },
  //     margin: { left: 14, right: 14 }
  //   });

  //   finalY = doc.lastAutoTable.finalY + 10;

  //   // Employees WITHOUT Bank Details
  //   doc.setFontSize(14);
  //   doc.text('Employees WITHOUT Bank Details', 14, finalY);

  //   autoTable(doc, {
  //     startY: finalY + 4,
  //     head: [['Emp ID', 'Name', 'Phone', 'Account Number', 'Total Salary']],
  //     body: reportData.without_bank_details.map(emp => [
  //       emp.EmployeeID,
  //       emp.FullName,
  //       emp.PhoneNumber,
  //       '-',
  //       `Rs. ${parseFloat(emp.TotalSalary).toFixed(2)}/-`
  //     ]),
  //     styles: { fontSize: 9 },
  //     headStyles: {
  //       fillColor: [14, 14, 35],
  //       textColor: [255, 255, 255]
  //     },
  //     alternateRowStyles: { fillColor: [240, 240, 240] },
  //     margin: { left: 14, right: 14 }
  //   });

  //   // Grand total
  //   finalY = doc.lastAutoTable.finalY + 10;
  //   doc.setFontSize(12);
  //   doc.setTextColor(33, 33, 33);
  //   doc.text(
  //     `Grand Total Salary: Rs. ${parseFloat(reportData.grand_total_salary).toFixed(2)}/-`,
  //     14,
  //     finalY
  //   );

  //   doc.save(`Salary_Report_${selectedMonth.replace('-', '_')}.pdf`);
  // };
  const handleDownloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Title
    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33);
    doc.text(`Salary Report`, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Month: ${selectedMonth}`, 105, 28, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 34, { align: 'center' });

    let finalY = 40;

    // Employees WITH Bank Details
    doc.setFontSize(14);
    doc.text('Employees WITH Bank Details', 14, finalY);

    const withBankTotal = reportData.with_bank_details.reduce(
      (sum, emp) => sum + parseFloat(emp.TotalSalary), 0
    );

    autoTable(doc, {
      startY: finalY + 4,
      head: [['Emp ID', 'Name', 'Phone', 'Account Number', 'Total Salary']],
      body: [
        ...reportData.with_bank_details.map(emp => [
          emp.EmployeeID,
          emp.FullName,
          emp.PhoneNumber,
          emp.AccountNumber,
          `Rs. ${parseFloat(emp.TotalSalary).toFixed(2)}/-`
        ]),
        [
          { content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
          `Rs. ${withBankTotal.toFixed(2)}/-`
        ]
      ],
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [14, 14, 35],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 }
    });

    finalY = doc.lastAutoTable.finalY + 10;

    // Employees WITHOUT Bank Details
    doc.setFontSize(14);
    doc.text('Employees WITHOUT Bank Details', 14, finalY);

    const withoutBankTotal = reportData.without_bank_details.reduce(
      (sum, emp) => sum + parseFloat(emp.TotalSalary), 0
    );

    autoTable(doc, {
      startY: finalY + 4,
      head: [['Emp ID', 'Name', 'Phone', 'Account Number', 'Total Salary']],
      body: [
        ...reportData.without_bank_details.map(emp => [
          emp.EmployeeID,
          emp.FullName,
          emp.PhoneNumber,
          '-',
          `Rs. ${parseFloat(emp.TotalSalary).toFixed(2)}/-`
        ]),
        [
          { content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
          `Rs. ${withoutBankTotal.toFixed(2)}/-`
        ]
      ],
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [14, 14, 35],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 }
    });

    // Grand total
    finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
    doc.text(
      `Grand Total Salary: Rs. ${parseFloat(reportData.grand_total_salary).toFixed(2)}/-`,
      14,
      finalY
    );

    doc.save(`Salary_Report_${selectedMonth.replace('-', '_')}.pdf`);
  };

  const handlePrint = () => {
    const printContents = document.getElementById('print-area').innerHTML;
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write('<html><head><title>Salary Report</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #000; padding: 8px; text-align: left; }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const fetchReport = () => {
    console.log(selectedMonth)
    if (!selectedMonth) {
      setError('Please select a month.');
      return;
    }

    setError('');
    fetch(`https://software.iqjita.com/hr/payroll_report.php?month=${selectedMonth}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch report');
        return res.json();
      })
      .then(data => {
        setReportData(data);
      })
      .catch(err => {
        setError(err.message);
      });
  };

  useEffect(() => {
    if (employeeData?.baseSalary) {
      setFormData((prev) => ({
        ...prev,
        baseSalary: parseFloat(employeeData.baseSalary || 0),
        totalSalary: parseFloat(employeeData.baseSalary || 0),
        leaveCompensation: 1 // user can override this, or default will apply in calculation
      }));
    }
  }, [employeeData]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   // const val = parseFloat(value) || 0;

  //   const val = name === "salarymonth" ? value : parseFloat(value) || 0;

  //   const updatedForm = {
  //     ...formData,
  //     [name]: val,
  //   };

  //   updatedForm.leaveCompensation = updatedForm.numLeaves >= 1 ? 0 : 1;

  //   const data = calculateTotalSalary(updatedForm);
  //   updatedForm.totalSalary = data.totalSalary;

  //   setcalculation(data)


  //   setFormData(updatedForm);

  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let val;

    if (name === "salarymonth" || name === "payDate") {
      val = value; // Keep as string for dates and months
    } else {
      val = parseFloat(value) || 0;
    }

    const updatedForm = {
      ...formData,
      [name]: val,
    };

    updatedForm.leaveCompensation = updatedForm.numLeaves >= 1 ? 0 : 1;

    const data = calculateTotalSalary(updatedForm);
    updatedForm.totalSalary = data.totalSalary;

    setcalculation(data);
    setFormData(updatedForm);
  };

  useEffect(() => {
    fetch("https://software.iqjita.com/hr/employee.php?action=read")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmpId(empId);

    if (!empId) return;

    fetch(`https://software.iqjita.com/hr/employee.php?action=read_single&EmployeeID=${empId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && res.data) {
          const emp = res.data;

          setEmployeeData({
            name: emp.FullName,
            department: emp.Department,
            designation: emp.Designation,
            baseSalary: parseFloat(emp.SalaryDetails?.NetSalaryMonthly || 0),
          });

          setFormData((prev) => ({
            ...prev,
            employeeId: emp.EmployeeID,
            name: emp.FullName,
            department: emp.Department,
            designation: emp.Designation,
            baseSalary: parseFloat(emp.SalaryDetails?.NetSalaryMonthly || 0),
            leaveCompensation: 1,
          }));
        }
      });
  };


  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...formData };

    setStatus("processing");

    try {
      const res = await fetch("https://software.iqjita.com/hr/payroll.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success === true) {
        console.log('payroll',result)
        setStatus("success");
        setLastPayroll({
          ...data,
          receiptId: result.bill_number || null,
        });

        // Log transaction
        // await fetch("https://software.iqjita.com/administration.php?action=transaction", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     amount: formData.totalSalary,
        //     type: "debit",
        //     category: "Salary pay",
        //     payment_method: formData.payment_method || "bank",
        //     remark: formData.employeeId || "N/A",
        //     updated_by: formData.updatedBy || "admin",
        //     payDate: formData.payDate,
        //   }),
        // });

        // Reset form
        // setFormData({
        //   employeeId: "",
        //   name: "",
        //   department: "",
        //   designation: "",
        //   numLeaves: 0,
        //   earlyOut: 0,
        //   lateComing: 0,
        //   reducingAmount: 0,
        //   leaveCompensation: 1,
        //   baseSalary: 0,
        //   totalSalary: 0,
        //   allowances: 0,
        //   salarymonth: getCurrentMonth(),
        //   payment_method: "bank",
        //   payDate: today,
        //   updatedBy: user.name,
        // });
      } else {
        setStatus("error");
        console.error("❌ Payroll failed:", result);
        alert(result.message || "Failed to add payroll");
      }
    } catch (err) {
      console.error("🔥 Network or server error:", err);
      setStatus("error");
      alert("Error adding payroll");
    }
  }



  function startNewPayroll() {
    setStatus("");         // clear status
    setLastPayroll(null);  // clear last saved data
    setSelectedEmpId(null)
    setFormData({
      employeeId: "",
      name: "",
      department: "",
      designation: "",
      numLeaves: 0,
      earlyOut: 0,
      lateComing: 0,
      reducingAmount: 0,
      leaveCompensation: 1,
      baseSalary: 0,
      totalSalary: 0,
      allowances: 0,
      salarymonth: getPreviousMonth(),
      payment_method: "bank",
      payDate: new Date().toISOString().slice(0, 10),
      updatedBy: user.name,
    });
  }
  // function downloadPDF(data) {
  //   const text = `
  // Salary Receipt
  // ---------------
  // Name: ${data.name}
  // ID: ${data.employeeId}
  // Designation: ${data.designation}
  // Department: ${data.department}
  // Total Salary: ₹${data.totalSalary}
  // Paid on: ${data.payDate}
  // `;

  //   const blob = new Blob([text], { type: "application/pdf" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `Salary_Receipt_${data.name}.pdf`;
  //   link.click();
  // }

  function sendViaWhatsApp(data) {
    const message = `Hi ${data.name}, your salary ₹${data.totalSalary} for ${data.salarymonth} has been paid on ${data.payDate}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  function sendViaSMS(data) {
    const message = `Hi ${data.name}, salary ₹${data.totalSalary} for ${data.salarymonth} paid on ${data.payDate}.`;
    alert("Simulated SMS:\n" + message);
    // Replace with SMS gateway logic (e.g., Twilio, MSG91)
  }

  function sendViaEmail(data) {
    const subject = `Salary Paid for ${data.salarymonth}`;
    const body = `Dear ${data.name},\n\nYour salary of ₹${data.totalSalary} for ${data.salarymonth} has been credited on ${data.payDate}.\n\nThank you.`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  const downloadPDF = (Payroll) => {
    const container = document.createElement("div");

    container.innerHTML = `
    <div style="
      width: 190mm;
      min-height: 148.5mm;
      font-family: Arial, sans-serif;
      color: #333;
      border-bottom: 1px dashed #ccc;
    ">
      <h1 style="
        text-align: center;
        font-size: 20px;
        margin-bottom: 10px;

      ">SALARY SLIP</h1>

      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      ">
        <div style="width: 100px; margin-bottom: 10px;">
          <img src="data:image/png;base64,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" alt="IQJITA Logo" style="width: 100%;" />
        </div>
        <div>
          <p><strong>IQJITA INSTITUTE OF EDUCATION</strong><br />SMART TRADE CITY, KOTTAKKAL</p>
          <p>PH: +91 6235774801</p>
          <p>Email: iqjita@gmail.com</p>
          <p>Web: www.iqjita.com</p>
        </div>
      </div>

      <div style="margin-top: 10px;">
        <h4 style="margin: 4px 0; border-bottom: none;">Receipt No: ${Payroll.receiptId || Payroll.ReceiptID}</h4>
        <h4 style="margin: 4px 0; border-bottom: none;">Employee Name: ${Payroll.name || Payroll.Name}</h4>
        <h4 style="margin: 4px 0; border-bottom: none;">Designation: ${Payroll.designation || Payroll.Designation}</h4>
        <h4 style="margin: 4px 0; border-bottom: none;">Month: ${Payroll.salarymonth || Payroll.SalaryMonth}</h4>
      </div>

      <table style="
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      ">
        <thead>
          <tr>
            <th style="background-color: #0F6D66; color: white; padding: 6px; text-align: left;">Description</th>
            <th style="background-color: #0F6D66; color: white; padding: 6px; text-align: left;">Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px; border-bottom: 1px solid #ddd;">Basic Salary</td>
            <td style="padding: 6px; border-bottom: 1px solid #ddd;">₹${Payroll.baseSalary || Payroll.BaseSalary}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border-bottom: 1px solid #ddd;">Allowances</td>
            <td style="padding: 6px; border-bottom: 1px solid #ddd;">₹${Payroll.allowances || Payroll.Allowances}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border-bottom: 1px solid #ddd;">Deductions</td>
            <td style="padding: 6px; border-bottom: 1px solid #ddd;">₹${Payroll.reducingAmount || Payroll.ReducingAmount}</td>
          </tr>
          <tr>
            <td style="padding: 6px; font-weight: bold;">Net Salary</td>
            <td style="padding: 6px; font-weight: bold;">₹${Payroll.totalSalary || Payroll.TotalSalary}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 10px;">
        <p><strong>Amount in words:</strong> ${numberToWords(Payroll.totalSalary || Payroll.TotalSalary)}</p>
        <p><strong>Processed by:</strong> ${Payroll.UpdatedBy || user.name}</p>
      </div>

      <div style="
        margin-top: 40px;
        text-align: right;
        font-style: italic;
        font-size: 14px;
        color: #555;
        padding-right: 20px;
        position: relative;
      ">
        <div style="
          width: 180px;
          height: 1px;
          background-color: #aaa;
          position: absolute;
          right: 20px;
          top: -10px;
        "></div>
        <p>Sign & seal</p>
      </div>
    </div>
  `;

    html2pdf()
      .set({
        margin: 0.3,
        filename: `SalarySlip_${sanitize(Payroll.name || Payroll.Name)}_${sanitize(Payroll.payDate || Payroll.PayDate)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .from(container)
      .save();
  };

  const sanitize = (str) => (str || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();

  const ReceiptPrint = (Receipt) => {
    // Store student data in localStorage

    console.log("receiptlog", Receipt)
    localStorage.setItem("SalarySlipData", JSON.stringify(Receipt));

    // Open the new print page
    window.open("/recipts/salaryslip.html", "_blank");
  };

  return (
    <>
      <h2 className='hr-title'>Payroll Information</h2>

      <div className="payroll-filter-container">
        {/* Left Side - Search by Name, Department, Designation */}
        <div className="payroll-filter-left">
          <input
            type="text"
            className="payroll-search-input"
            placeholder="Search by Name, Department or Designation"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right Side - Month Filters & Employee ID Search */}
        <div className="payroll-filter-right">
          <button className="payroll-hr-button" onClick={() => setShowModal(true)}> Pay Salary  </button>
          <button className="payroll-filter-btn" onClick={() => handleMonthFilter('thisMonth')}>This Month</button>
          <button className="payroll-filter-btn" onClick={() => handleMonthFilter('previousMonth')}>Previous Month</button>
          <button
            className="hr-report-filter-btn"
            onClick={() => {
              setShowReport(true);
              fetchReport();
            }}
          >
            Report
          </button>

          {showReport && (
            <div className="hr-report-modal-overlay">
              <div className="hr-report-modal">
                <div className="hr-report-modal-header">
                  <h2>Payroll Report</h2>
                  <button className="hr-report-close-btn" onClick={() => setShowReport(false)}>
                    <FaTimes />
                  </button>
                </div>

                <div className="hr-report-modal-body">
                  {/* <button className="hr-report-fetch-btn" onClick={fetchReport}>
                    Load Report
                  </button> */}

                  {error && <p className="hr-report-error">{error}</p>}

                  {reportData && (
                    <>
                      <div className='hr-report-main-table'>
                        <h3>Employees WITH Bank Details</h3>
                        <table className="hr-report-table">
                          <thead>
                            <tr>
                              <th>Emp ID</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Account Number</th>
                              <th>Total Salary</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.with_bank_details.map(emp => (
                              <tr key={emp.EmployeeID}>
                                <td>{emp.EmployeeID}</td>
                                <td>{emp.FullName}</td>
                                <td>{emp.PhoneNumber}</td>
                                <td>{emp.AccountNumber}</td>
                                <td>₹ {parseFloat(emp.TotalSalary).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <h3>Employees WITHOUT Bank Details</h3>
                        <table className="hr-report-table">
                          <thead>
                            <tr>
                              <th>Emp ID</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Account Number</th>
                              <th>Total Salary</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.without_bank_details.map(emp => (
                              <tr key={emp.EmployeeID}>
                                <td>{emp.EmployeeID}</td>
                                <td>{emp.FullName}</td>
                                <td>{emp.PhoneNumber}</td>
                                <td>-</td>
                                <td>₹ {parseFloat(emp.TotalSalary).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className='hr-report-footer'>
                        <div className="hr-report-total">
                          <strong style={{ color: 'white' }}>
                            Grand Total Salary: ₹ {parseFloat(reportData.grand_total_salary).toFixed(2)}
                          </strong>

                        </div>

                        <div className="hr-report-pdf">
                          <div className="hr-report-action" onClick={handleDownloadPDF}>
                            <FaFilePdf className="hr-report-action-icon pdf-icon" /> Download PDF
                          </div>
                          <div className="hr-report-action" onClick={handlePrint}>
                            <FaPrint className="hr-report-action-icon print-icon" /> Print
                          </div>


                        </div>

                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          )}
          <input
            type="month"
            className="payroll-month-picker"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />

          {/* <select
            className="payroll-employee-id-input"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">Select Employee ID</option>
            {employees.map((employee) => (
              <option key={employee.EmployeeID} value={employee.EmployeeID}>
                {employee.EmployeeID} - {employee.FullName}
              </option>
            ))}
          </select> */}

        </div>
      </div>

      <div className="payroll-table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>PAY DATE</th>
              {/* <th>Designation</th> */}
              {/* <th>NO OF LEAVES</th> */}
              {/* <th>EARLY OUT</th> */}
              {/* <th>LATE COMING</th> */}
              {/* <th>REDUCEING AMOUNT</th> */}
              {/* <th>LEAVE COMPENSATION</th> */}
              <th>SALARY</th>
              <th>TOTAL SALARY</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? (
              filteredData
                .filter((item) => {
                  const search = searchTerm.toLowerCase();
                  return (
                    item.EmployeeID?.toLowerCase().includes(search) ||
                    item.Name?.toLowerCase().includes(search) ||
                    item.Department?.toLowerCase().includes(search) ||
                    item.Designation?.toLowerCase().includes(search)
                  );
                })
                .map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'payroll-row' : 'payroll-row-alt'}>
                    <td>{item.EmployeeID}</td>
                    <td>{item.Name}</td>
                    <td>{item.Department}</td>
                    <td>{item.PayDate}</td>
                    {/* <td>{item.Designation}</td> */}
                    {/* <td>{item.NumLeaves}</td> */}
                    {/* <td>{item.EarlyOut}</td> */}
                    {/* <td>{item.LateComing}</td> */}
                    {/* <td>{item.ReducingAmount}</td> */}
                    {/* <td>{item.LeaveCompensation}</td> */}
                    <td>{item.BaseSalary}</td>
                    <td>{item.TotalSalary}</td>
                    <td>
                      <button
                        className="payroll-action-btn"
                        onClick={() => openModal(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '15px' }}>
                  No results found.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedPayroll && (
        <div className="payroll-modal-overlay" onClick={closeModal}>
          <div className="payroll-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btns" onClick={closeModal}>
              &times;
            </button>
            <div className="payroll-modal-header">
              <h3 className="payroll-heading">Payroll Details</h3>

            </div>

            <div className="payroll-modal-body" >
              <div className="payroll-columns-container">
                {/* Left Column */}
                <div className="payroll-column">
                  <div className="detail-row">
                    <span className="detail-label">Employee ID:</span>
                    <span className="detail-value">{selectedPayroll.EmployeeID}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value highlight">{selectedPayroll.Name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{selectedPayroll.Department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Designation:</span>
                    <span className="detail-value">{selectedPayroll.Designation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Salary Month:</span>
                    <span className="detail-value">{selectedPayroll.SalaryMonth}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Pay Date:</span>
                    <span className="detail-value">{selectedPayroll.PayDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Updated By:</span>
                    <span className="detail-value">{selectedPayroll.UpdatedBy}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="payroll-column financial-column">
                  <div className="detail-row">
                    <span className="detail-label">Base Salary:</span>
                    <span className="detail-value amount">₹{selectedPayroll.BaseSalary.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Allowances:</span>
                    <span className="detail-value amount positive">+₹{selectedPayroll.Allowances.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deductions:</span>
                    <span className="detail-value amount negative">-₹{selectedPayroll.ReducingAmount.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Leave Compensation:</span>
                    <span className="detail-value amount">{selectedPayroll.LeaveCompensation.toLocaleString()}</span>
                  </div>
                  <div className="detail-row total-row">
                    <span className="detail-label">Total Salary:</span>
                    <span className="detail-value amount total">₹{selectedPayroll.TotalSalary.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value method">{selectedPayroll.PaymentMethod}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Receipt No:</span>
                    <span className="detail-value method">{selectedPayroll.ReceiptID}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="payroll-modal-footer">
              <div className="action-item">
                <p>WhatsApp</p>
                <span className="action-icon" onClick={() => sendViaWhatsApp(lastPayroll)}>
                  <FaWhatsapp style={{ color: "#25D366", fontSize: "20px" }} />
                </span>
              </div>
              <div className="action-item">
                <p>Download Receipt</p>
                <span className="action-icon" onClick={() => downloadPDF(selectedPayroll)}>
                  <FaFileDownload style={{ color: "#007BFF", fontSize: "20px" }} />
                </span>
              </div>
              <button
                className="payroll-print-btn"
                onClick={() =>
                  ReceiptPrint({
                    name: selectedPayroll.Name,
                    designation: selectedPayroll.Designation,
                    month: selectedPayroll.SalaryMonth,
                    // date: selectedPayroll. ,
                    basic: selectedPayroll.BaseSalary || 0,
                    allowances: selectedPayroll.Allowances || 0,
                    deductions: selectedPayroll.ReducingAmount || 0,
                    net: selectedPayroll.TotalSalary || 0,
                    processed_by: selectedPayroll.UpdatedBy,
                    payment_method: selectedPayroll.PaymentMethod,
                    receiptid: selectedPayroll.ReceiptID,
                    department: selectedPayroll.Department,
                    employeeId: selectedPayroll.EmployeeID
                  })
                }
              >
                Print Payslip
              </button>


            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="payroll-hr-overlay">
          <div className="payroll-hr-modal">
            <button
              className="payroll-hr-close-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3>Create Payroll</h3>
            <div className='payroll-hr-form-main'>
              <div className='payroll-hr-form'>
                <form onSubmit={handleSubmit} >
                  <div className="payroll-hr-form-grid">
                    <div className="payroll-hr-form-col">
                      <label>
                        Employee ID
                        <select value={selectedEmpId} onChange={handleEmployeeChange} required>
                          <option value="">Select Employee</option>
                          {employees.map((emp) => (
                            <option key={emp.EmployeeID} value={emp.EmployeeID}>
                              {emp.EmployeeID} - {emp.FullName}
                            </option>
                          ))}
                        </select>
                      </label>



                      <label>
                        Name
                        <input
                          name="name"
                          placeholder="Name"
                          value={employeeData.name}
                          readOnly
                          required
                        />
                      </label>

                      <label>
                        Department
                        <input
                          name="department"
                          placeholder="Department"
                          value={employeeData.department}
                          readOnly
                          required
                        />
                      </label>

                      <label>
                        Designation
                        <input
                          name="designation"
                          placeholder="Designation"
                          value={employeeData.designation}
                          readOnly
                          required
                        />
                      </label>


                      <label>
                        Number of Leaves
                        <input
                          name="numLeaves"
                          type="number"
                          // min="0"
                          placeholder="Leaves"
                          value={formData.numLeaves}
                          onChange={handleInputChange}
                          required
                        />

                      </label>

                      <label>
                        Early Out
                        <input
                          name="earlyOut"
                          type="number"
                          min="0"
                          placeholder="Early Out"
                          value={formData.earlyOut}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                      <label>
                        Late Coming
                        <input
                          name="lateComing"
                          type="number"
                          min="0"
                          placeholder="Late Coming"
                          value={formData.lateComing}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                      {/* <label className='desknetsalary'>
                        NET SALARY :
                        <h1 style={{ color: "white" }}>Rs.{formData.totalSalary}/-</h1>
                      </label> */}
                      <label>
                        Allowances
                        <input
                          name="allowances"
                          type="number"
                          min="0"
                          placeholder="Allowances"
                          value={formData.allowances}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>


                    <div className="payroll-hr-form-col">




                      <label>
                        Reducing Amount
                        <input
                          name="reducingAmount"
                          type="number"
                          min="0"
                          placeholder="Reducing Amount"
                          value={formData.reducingAmount}
                          onChange={handleInputChange}
                          required
                        />
                      </label>

                      <label>
                        Leave Compensation
                        <input
                          name="leaveCompensation"
                          type="number"
                          min="0"
                          placeholder="Leave Compensation"
                          value={formData.leaveCompensation}
                          onChange={handleInputChange}
                          required
                        />
                      </label>

                      <label>
                        Base Salary
                        <input
                          name="baseSalary"
                          type="number"
                          min="0"
                          placeholder="Base Salary"
                          value={employeeData.baseSalary}
                          readOnly
                          required
                        />
                      </label>


                      <label>
                        Total Salary
                        <input
                          name="totalSalary"
                          type="number"
                          min="0"
                          placeholder="Total Salary"
                          value={formData.totalSalary}
                          readOnly
                          required
                        />
                      </label>
                      <label>
                        Salary Month
                        <input
                          name="salarymonth"
                          type="month"
                          max={getCurrentMonth()}
                          value={formData.salarymonth}
                          onChange={handleInputChange}
                          required
                        />
                      </label>

                      <label>
                        Pay Date
                        <input
                          name="payDate"
                          type="date"
                          max={today}
                          value={formData.payDate}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                      <label>
                        Payment Method
                        <select
                          name="payment_method"
                          value={formData.payment_method}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Method</option>
                          <option value="bank">Bank</option>
                          <option value="upi">UPI</option>
                          <option value="cash">Cash</option>
                        </select>
                      </label>
                      <label className='mobnetsalary'>
                        NET SALARY :
                        <h1 style={{ color: "white" }}>Rs.{formData.totalSalary}/-</h1>
                      </label>



                      {/* <label>
                    Updated By
                    <input name="updatedBy" placeholder="Updated By" required />
                  </label> */}
                    </div>

                  </div>

                  <button type="submit" className="payroll-hr-submit-btn">Submit</button>
                </form>
              </div>
              <div className='payroll-hr-rightside'>
                <div className='methematical-method'>
                  <h4>Mathematical Method</h4>
                  <pre style={{ fontFamily: 'monospace', fontSize: '16px' }}>
                    {`Base Salary:           ₹ ${calculation.baseSalary}
- Leave Deduction:      ₹ ${calculation.leaveDeduction}
- Late/Early Deduction: ₹ ${calculation.lateEarlyDeduction}
- Other Deductions:     ₹ ${calculation.reducingAmount}
+ Allowances:           ₹ ${formData.allowances}
-------------------------------------
= Final Salary:         ₹ ${Math.round(calculation.totalSalary >= 0 ? calculation.totalSalary : 0)}
`}
                  </pre>
                </div>




                <div className="proccesing-area">
                  {status === "processing" && <p>🔄 Processing payroll, please wait...</p>}

                  {status === "success" && lastPayroll && (
                    <div>

                      <p>✅ Payroll successfully added for <strong
                        className="payroll-name"
                        data-name={lastPayroll.name}
                      >
                        {lastPayroll.name.length > 10
                          ? `${lastPayroll.name.substring(0, 5)}...`
                          : lastPayroll.name
                        }
                      </strong>.</p>
                      <div className="action-buttons-hr">
                        <div className="action-links">
                          <div className="action-item">
                            <p>Download Receipt</p>
                            <span className="action-icon" onClick={() => downloadPDF(lastPayroll)}>
                              <FaFileDownload style={{ color: "#007BFF", fontSize: "20px" }} />
                            </span>
                          </div>



                          <div className="action-item">
                            <p>Print</p>
                            <span
                              className="action-icon"
                              onClick={() =>
                                ReceiptPrint({
                                  name: lastPayroll.name,
                                  designation: lastPayroll.Designation || lastPayroll.designation,
                                  month: lastPayroll.SalaryMonth || lastPayroll.salarymonth,
                                  receiptid: lastPayroll.receiptId,
                                  date: lastPayroll.payDate || 0,
                                  basic: lastPayroll.baseSalary || 0,
                                  allowances: lastPayroll.allowances || 0,
                                  deductions: lastPayroll.reducingAmount || 0,
                                  net: lastPayroll.totalSalary || 0,
                                  processed_by: user.name
                                })
                              }
                            >
                              <FaPrint style={{ color: "#6C757D", fontSize: "20px" }} />
                            </span>
                          </div>


                          <div className="action-item">
                            <p>WhatsApp</p>
                            <span className="action-icon" onClick={() => sendViaWhatsApp(lastPayroll)}>
                              <FaWhatsapp style={{ color: "#25D366", fontSize: "20px" }} />
                            </span>
                          </div>

                          <div className="action-item">
                            <p>SMS</p>
                            <span className="action-icon" onClick={() => sendViaSMS(lastPayroll)}>
                              <FaSms style={{ color: "#17A2B8", fontSize: "20px" }} />
                            </span>
                          </div>

                          <div className="action-item">
                            <p>Email</p>
                            <span className="action-icon" onClick={() => sendViaEmail(lastPayroll)}>
                              <FaEnvelope style={{ color: "#DC3545", fontSize: "20px" }} />
                            </span>
                          </div>

                          <div className="action-item button-style" onClick={startNewPayroll}>
                            <p>New Payroll</p>
                            <span className="action-icon">
                              <FaPlusCircle style={{ fontSize: "20px" }} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <p style={{ color: "red" }}>❌ Failed to submit payroll. Please try again.</p>
                  )}
                </div>

              </div>

            </div>

          </div >

        </div >
      )}
      <div style={{ display: 'none' }}>
        <div id="print-area">
          {/* Same content you build for PDF: headings, tables, total */}
          <h1 style={{ textAlign: 'center' }}>Salary Report</h1>
          <p style={{ textAlign: 'center' }}>Month: {selectedMonth}</p>
          <p style={{ textAlign: 'center' }}>
            Generated: {new Date().toLocaleString()}
          </p>

          <h2>Employees WITH Bank Details</h2>
          <table>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Account Number</th>
                <th>Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.with_bank_details.map(emp => (
                <tr key={emp.EmployeeID}>
                  <td>{emp.EmployeeID}</td>
                  <td>{emp.FullName}</td>
                  <td>{emp.PhoneNumber}</td>
                  <td>{emp.AccountNumber}</td>
                  <td>Rs. {parseFloat(emp.TotalSalary).toFixed(2)}/-</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                <td style={{ fontWeight: 'bold' }}>
                  Rs. {reportData?.with_bank_details.reduce((sum, emp) => sum + parseFloat(emp.TotalSalary), 0).toFixed(2)}/-
                </td>
              </tr>
            </tbody>
          </table>

          <h2>Employees WITHOUT Bank Details</h2>
          <table>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Account Number</th>
                <th>Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.without_bank_details.map(emp => (
                <tr key={emp.EmployeeID}>
                  <td>{emp.EmployeeID}</td>
                  <td>{emp.FullName}</td>
                  <td>{emp.PhoneNumber}</td>
                  <td>-</td>
                  <td>Rs. {parseFloat(emp.TotalSalary).toFixed(2)}/-</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                <td style={{ fontWeight: 'bold' }}>
                  Rs. {reportData?.without_bank_details.reduce((sum, emp) => sum + parseFloat(emp.TotalSalary), 0).toFixed(2)}/-
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Grand Total Salary: Rs. {parseFloat(reportData?.grand_total_salary).toFixed(2)}/-</h3>
        </div>
      </div>



    </>
  );
};

export default PayrollTable;

