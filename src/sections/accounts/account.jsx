import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

import './account.css';

const Account = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [height, setHeight] = useState(window.innerWidth < 480 ? 200 : 300);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenhistory, setIsOpenhistory] = useState(false);
     const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [history, setHistory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("all"); // 'all', 'credit', 'debit'
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [transactionError, setTransactionError] = useState("");
    const [closingAmount, setClosingAmount] = useState('');
    const [closingAmountbalance, setClosingbalanceAmount] = useState('');
    const [graphData, setgraphTransactions] = useState([]);
    const [period, setPeriod] = useState('day');
    const [income, setIncome] = useState(0);
    const [change, setChange] = useState(0);
    const [closingremark, setClosingremark] = useState("");
    const [isClosePopupOpen, setIsClosePopupOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('');
 
    // const [closingAmount, setClosingAmount] = useState(0);


    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCredits, setTotalCredits] = useState({
        cash: 0,
        bank: 0,
        upi: 0,
        total: 0,
        closed: 0,
        balance: 0
    });
    //   const [totalAmount, setTotalAmount] = useState(0);

    const [formData, setFormData] = useState({
        amount: '',
        type: 'debit',
        payment_method: '',
        category: '',
        remark: ''
    });
    const [showPopup, setShowPopup] = useState(false);
    // const [transactions, setTransactionss] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        if (showPopup) {
            fetchTransactions();
        }
    }, [showPopup]);

    // const fetchTransactionss = async () => {
    //     try {
    //         const response = await fetch("https://your-domain.com/api/get_transactions.php");
    //         const data = await response.json();
    //         setTransactions(data);
    //     } catch (err) {
    //         console.error("Failed to fetch transactions", err);
    //     }
    // };

    const handleEditClick = (index) => {
        setEditingRow(index);
        setEditedData({ ...transactions[index] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // send to backend (update logic)
        const res = await fetch("https://software.iqjita.com/update_transaction.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedData),
        });
        const result = await res.json();
        if (result.success) {
            const newTransactions = [...transactions];
            newTransactions[editingRow] = editedData;
            setTransactions(newTransactions);
            setEditingRow(null);
        }
    };
    const filteredTransactions = transactions.filter((txn) =>
        txn.bill_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // const totalCredits = {
    //     cash: 2500.00,
    //     bank: 7200.50,
    //     upi: 1300.75,
    //   };
    //   const totalAmount = totalCredits.cash + totalCredits.bank + totalCredits.upi;
    //   const handleSubmitclosing = () => {
    //     if (!closingAmount || isNaN(closingAmount)) {
    //       alert("Please enter a valid closing amount.");
    //       return;
    //     }

    //     setIsOpen(false);
    //     alert(`Bank closing of ₹${closingAmount} submitted!`);
    //     // TODO: Add API call to save closing data
    //   };
    //   useEffect(() => {
    //     // Fetch initial transactions
    //     fetch("https://software.iqjita.com/administration.php?action=transaction")
    //       .then(res => res.json())
    //       .then(data => setTransactions(data))
    //       .catch(err => console.error("Failed to fetch transactions", err));
    //   }, []);

    const creditTotal = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + Number(t.amount), 0);
    const debitTotal = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Number(t.amount), 0);

    // const graphData = [
    //     { name: 'Jan', credit: 1200, debit: 800 },
    //     { name: 'Feb', credit: 1400, debit: 900 },
    //     { name: 'Mar', credit: 1000, debit: 700 },
    //     { name: 'Apr', credit: 1600, debit: 1100 },
    //     { name: 'May', credit: 1500, debit: 950 },
    //     { name: 'Jun', credit: 1300, debit: 980 },
    //     { name: 'Jul', credit: 1700, debit: 1050 },
    //     { name: 'Aug', credit: 1800, debit: 1150 },
    //     { name: 'Sep', credit: 1250, debit: 970 },
    //     { name: 'Oct', credit: 1400, debit: 1100 },
    //     { name: 'Nov', credit: 1500, debit: 900 },
    //     { name: 'Dec', credit: 1600, debit: 950 }
    // ];

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleCloseBalance = (date, amount, credited_by = user.name) => {
        const remark = prompt("Add remark for closing:");
        if (!remark) return;

        fetch("https://software.iqjita.com/accounts.php?action=update_bank_closing", {
            method: "POST",
            body: JSON.stringify({
                target_date: date,
                closing_amount: amount,
                remark,
                credited_by,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((res) => {
                alert(res.message);
                if (res.status === "success") {
                    // refresh
                    //   setHistory((prev) =>
                    //     prev.map((row) =>
                    //       row.period === date
                    //         ? { ...row, closed_amount: row.closed_amount + amount, balance: 0 }
                    //         : row
                    //     )
                    //   );
                    fetchHistory()
                }
            });
    };
    const [groupBy, setGroupBy] = useState('day'); // Default to 'day'

    // Fetch history when the component mounts or groupBy changes
    useEffect(() => {
        fetchHistory(groupBy);
    }, [groupBy]);

    // Toggle between 'day' and 'month'
    const handleGroupToggle = (group) => {
        setGroupBy(group);
    };
    const fetchHistory = (groupBy = 'day') => {
        fetch(`https://software.iqjita.com/accounts.php?action=get_bank_closing_history&group_by=${groupBy}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    setHistory(data.data);
                    console.log("accounts history==", data.data)
                }
            });
    };

    const handleSubmitclosing = () => {
        fetch("https://software.iqjita.com/accounts.php?action=submit_closing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                closing_amount: parseFloat(closingAmount),
                credited_by: user.name, // dynamic if you use login
                remark: closingremark
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                setIsOpen(false);
            });
    };
    useEffect(() => {
        if (isOpen) {
            fetch("https://software.iqjita.com/accounts.php?action=get_today_summary")
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        setTotalCredits(data.data);
                        setTotalAmount(data.data.total);
                        setClosingAmount(data.data.balance); // default fill with balance
                    }
                });
        }
    }, [isOpen]); // only runs when isOpen changes

    const handleSubmit = async () => {
        try {
            const transactionResponse = await fetch("https://software.iqjita.com/administration.php?action=transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: formData.amount,
                    type: formData.type,
                    category: formData.category,
                    remark: formData.remark,
                    payment_method: formData.payment_method,
                    updated_by: user.name || 'admin',
                }),
            });

            if (transactionResponse.ok) {
                const newTransaction = await transactionResponse.json();
                // setTransactions(prev => [newTransaction, ...prev]);
                fetchTransactions();
                setShowModal(false);
                setFormData({ amount: '', type: 'debit', category: '', remark: '' });
            } else {
                alert("Failed to add transaction");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };
    useEffect(() => {
        fetchTransactions();
    }, [filter, date, month, startDate, endDate]);
    useEffect(() => {
        fetchTransactions();
    }, []);
    const fetchTransactions = async () => {
        let url = "https://software.iqjita.com/administration.php?action=gettransactiondetails";

        if (filter !== "all") url += `&type=${filter}`;
        if (date) url = `https://software.iqjita.com/administration.php?action=gettransactiondetails&date=${date}`;
        if (month) url = `https://software.iqjita.com/administration.php?action=gettransactiondetails&month=${month}`;
        if (startDate && endDate) url = `https://software.iqjita.com/administration.php?action=gettransactiondetails&start_date=${startDate}&end_date=${endDate}`;

        try {
            console.log("urlsss..", url)
            const response = await fetch(url);
            const text = await response.text();
            console.log("🔍 Raw API Response Transactions:", text); // Debugging log

            // ✅ Split response if multiple JSON objects exist
            const jsonObjects = text.trim().split("\n");
            const lastJson = jsonObjects.pop(); // Take the second (last) JSON object

            let data;
            try {
                data = JSON.parse(lastJson); // ✅ Parse the correct JSON
            } catch (error) {
                throw new Error("❌ Invalid JSON response from server:\n");
            }

            if (data.status === "success") {
                setTransactions(data.transactions);
                setTransactionError(""); // ✅ Clear any previous error
            } else {
                setTransactions([]); // Clear transactions
                setTransactionError(data.message || "No transactions found"); // ✅ Set error message
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    // const [period, setPeriod] = useState('today');

    useEffect(() => {
        fetch(`https://software.iqjita.com/administration.php?action=getTransactionGraph&filter=${period}`)
            .then(res => res.json())
            .then(response => {
                if (response.status === 'success') {
                    setgraphTransactions(response.data);
                    const values = response.data;

                    // Get the last (latest) and second last (previous) month's credit
                    const lastMonth = values[values.length - 1];
                    const prevMonth = values[values.length - 2] || { credit: 0 };

                    const current = lastMonth.credit;
                    const previous = prevMonth.credit;

                    const percentageChange =
                        previous > 0 ? ((current - previous) / previous) * 100 : 0;

                    setIncome(current);
                    setChange(percentageChange);

                } else {
                    console.error('API Error:', response.message);
                }
            })
            .catch(err => console.error('Failed to load transactions', err));
    }, [period]);


    //   const getFilteredTransactions = (periodType) => {
    //     const now = new Date();
    //     const start = new Date();
    //     const end = new Date();

    //     switch (periodType) {
    //       case 'today':
    //         return transactions.filter(t => isSameDay(new Date(t.created_at), now));
    //       case 'yesterday':
    //         start.setDate(start.getDate() - 1);
    //         return transactions.filter(t => isSameDay(new Date(t.created_at), start));
    //       case 'thisWeek':
    //         start.setDate(now.getDate() - now.getDay());
    //         return transactions.filter(t => new Date(t.created_at) >= start);
    //       case 'lastWeek':
    //         const lastWeekStart = new Date(now);
    //         lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
    //         const lastWeekEnd = new Date(lastWeekStart);
    //         lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
    //         return transactions.filter(t => {
    //           const d = new Date(t.created_at);
    //           return d >= lastWeekStart && d <= lastWeekEnd;
    //         });
    //       case 'thisMonth':
    //         return transactions.filter(t => isSameMonth(new Date(t.created_at), now));
    //       case 'lastMonth':
    //         start.setMonth(now.getMonth() - 1);
    //         return transactions.filter(t => isSameMonth(new Date(t.created_at), start));
    //       default:
    //         return [];
    //     }
    //   };

    //   const isSameDay = (d1, d2) =>
    //     d1.getDate() === d2.getDate() &&
    //     d1.getMonth() === d2.getMonth() &&
    //     d1.getFullYear() === d2.getFullYear();

    //   const isSameMonth = (d1, d2) =>
    //     d1.getMonth() === d2.getMonth() &&
    //     d1.getFullYear() === d2.getFullYear();

    //   const current = getFilteredTransactions(period);
    //   const previous = getFilteredTransactions(
    //     period === 'today' ? 'yesterday' :
    //     period === 'thisWeek' ? 'lastWeek' :
    //     period === 'thisMonth' ? 'lastMonth' : 'yesterday'
    //   );

    //   const totalCurrent = current
    //     .filter(t => t.type === 'credit')
    //     .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    //   const totalPrevious = previous
    //     .filter(t => t.type === 'credit')
    //     .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    //   const percentageChange = totalPrevious === 0
    //     ? 100
    //     : ((totalCurrent - totalPrevious) / totalPrevious) * 100;

    //   const getLabel = () => {
    //     switch (period) {
    //       case 'today': return 'Today';
    //       case 'thisWeek': return 'This Week';
    //       case 'thisMonth': return 'This Month';
    //       default: return 'Period';
    //     }
    //   };

    return (
        <div className="account-section">
            <h2 className='heading'>Accounting Overview</h2>
            <div className="account-graph-ca">


                <div className="account-graph-card">
                    <div className="account-header">
                        <div>
                            <p className="account-label">Income</p>
                            <h2 className="account-amount">
                                Rs {income.toLocaleString()}
                                <span className={change >= 0 ? "green" : "red"}>
                                    {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                                </span>
                            </h2>
                        </div>
                        <div className="account-time">
                            <select
                                className="account-filter"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                <option value="day">DAY</option>
                                <option value="week">WEEK</option>
                                <option value="month">MONTH</option>
                                <option value="year">YEAR</option>
                            </select>
                        </div>
                    </div>
                    <div className='graph1'>
                        <ResponsiveContainer width="100%" height={window.innerWidth < 480 ? 200 : 300}>
                            <AreaChart data={graphData}>
                                <defs>
                                    <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#5b8efc" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#5b8efc" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f06292" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#f06292" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: "#999" }}
                                    tickMargin={8}
                                />
                                <YAxis
                                    tickFormatter={(value) => {
                                        return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
                                    }}
                                    tick={{ fontSize: 11, fill: "#999" }}
                                    tickMargin={8}
                                />
                                <Tooltip
                                    // formatter={(value) => {
                                    //     return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
                                    //   }}
                                    contentStyle={{
                                        color: "white",
                                        backgroundColor: "#1e1e2f",
                                        border: "none",
                                        borderRadius: 14,
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                        color: "#ccc",
                                        fontSize: "12px",
                                    }}
                                />


                                <Area
                                    type="monotone"
                                    dataKey="credit"
                                    stroke="#5b8efc"
                                    fillOpacity={1}
                                    fill="url(#colorCredit)"
                                    strokeWidth={2.5}
                                    animationDuration={1000}
                                    dot={{ r: 3 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="debit"
                                    stroke="#f06292"
                                    fillOpacity={1}
                                    fill="url(#colorDebit)"
                                    strokeWidth={2.5}
                                    animationDuration={1000}
                                    dot={{ r: 3 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#bbb" }} />
          <YAxis tick={{ fontSize: 12, fill: "#bbb" }} />
          <Tooltip contentStyle={{ backgroundColor: "#1e1e2f", border: "none" }} />
          <Legend iconType="circle" wrapperStyle={{ color: "#ccc", fontSize: 12 }} />
          <Line type="monotone" dataKey="credit" stroke="#5b8efc" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="debit" stroke="#f06292" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer> */}
            </div>
            <div className='buttoncard'>
                <div className="stat-cards">
                    <div className="stat-card" onClick={() => setShowModal(true)}>
                        <h2>Transations</h2>
                        <p>Manage transactions</p>
                    </div>
                    <div className="stat-card" onClick={() => setIsOpen(true)} >
                        <h2>Bank Closing</h2>
                        <p>Handle daily collections and close accounts</p>
                    </div>
                    <div className="stat-card" onClick={() => setIsOpenhistory(true)}>
                        <h2>Report</h2>
                        <p>Generate and review reports</p>
                    </div>

                </div>
            </div>
            <div>
                <div>
                    {user.role=== "superadmin" && (
                        <button className="open-btn" onClick={() => setShowPopup(true)}>
                            Edit transaction
                        </button>
                    )}
                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <div className="popup-header">
                                    <h3>Transaction List</h3>
                                    <button className="close-btn " style={{
                                        fontSize: "24px",
                                        background: "transparent",
                                        border: "none",
                                        color: "#333",

                                    }} onClick={() => setShowPopup(false)}>×</button>
                                </div>

                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Search by Bill Number"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <table className="transaction-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Amount</th>
                                            <th>Type</th>
                                            <th>Bill No</th>
                                            <th>Balance</th>
                                            <th>Method</th>
                                            <th>Remark</th>
                                            <th>Updated By</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((txn, index) => (
                                            <tr key={txn.transaction_id}>
                                                {editingRow === index ? (
                                                    <>
                                                        <td>{txn.transaction_id}</td>
                                                        <td><input name="amount" value={editedData.amount} onChange={handleChange} /></td>
                                                        <td>
                                                            <select name="type" value={editedData.type} onChange={handleChange}>
                                                                <option value="credit">credit</option>
                                                                <option value="debit">debit</option>
                                                            </select>
                                                        </td>
                                                        <td><input name="bill_number" value={editedData.bill_number} onChange={handleChange} /></td>
                                                        <td><input name="current_balance" value={editedData.current_balance} onChange={handleChange} /></td>
                                                        <td>
                                                            <select name="payment_method" value={editedData.payment_method} onChange={handleChange}>
                                                                <option value="cash">CASH</option>
                                                                <option value="upi">UPI</option>
                                                                <option value="bank">BANK</option>
                                                            </select>
                                                        </td>
                                                        <td><input name="remark" value={editedData.remark} onChange={handleChange} /></td>
                                                        <td><input name="updated_by" value={editedData.updated_by} onChange={handleChange} /></td>
                                                        <td>
                                                            <button onClick={handleSave}>Save</button>
                                                            <button onClick={() => setEditingRow(null)}>Cancel</button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{txn.transaction_id}</td>
                                                        <td>{txn.amount}</td>
                                                        <td>{txn.type}</td>
                                                        <td>{txn.bill_number}</td>
                                                        <td>{txn.current_balance}</td>
                                                        <td>{txn.payment_method}</td>
                                                        <td>{txn.remark}</td>
                                                        <td>{txn.updated_by}</td>
                                                        <td><button onClick={() => handleEditClick(index)}>Edit</button></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

            </div>



            <div className="table-header">
                <h3>Recent Transactions</h3>
                {/* <button onClick={() => setShowModal(true)}>+ Add Expense</button> */}
            </div>

            {/* <div className="Transactions-head">
                {/* <h2>All Transactions</h2> */}

            {/* Buttons: Close & Full Screen Toggle */}
            {/* <div className="popup-buttons">
                    <button className="fullscreen-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
                        {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                    <button className="close-modal" onClick={() => setShowPopup(false)}>×</button>
                </div> */}


            {/* Filters */}
            <div className="filters-container account desktop-only">
                <div className="filter-group account">
                    <label>Transaction Type</label>
                    <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                        <option value="all">All</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                </div>

                <div className="filter-group account">
                    <label>Filter by Date</label>
                    <input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
                </div>

                <div className="filter-group account">
                    <label>Filter by Month</label>
                    <input type="month" onChange={(e) => setMonth(e.target.value)} value={month} />
                </div>

                <div className="filter-group account">
                    <label>Start Date</label>
                    <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                </div>

                <div className="filter-group account">
                    <label>End Date</label>
                    <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                </div>
            </div>
             <div className="mobile-only">
        <button className="open-filter-btn" onClick={() => setShowMobileFilter(true)}>Filter</button>
      </div>

      {/* Mobile Modal Popup */}
      {showMobileFilter && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn"  style={{
    
    color: 'black',
  
  }}
onClick={() => setShowMobileFilter(false)}>×</button>
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Transaction Type</label>
              <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option value="all">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by Date</label>
              <input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
            </div>

            <div className="filter-group">
              <label>Filter by Month</label>
              <input type="month" onChange={(e) => setMonth(e.target.value)} value={month} />
            </div>

            <div className="filter-group">
              <label>Start Date</label>
              <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
            </div>

            <div className="filter-group">
              <label>End Date</label>
              <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowMobileFilter(false)}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

            {/* Transaction Table */}
            <div className="popup-table-container accocunt">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Bill Number</th>
                            <th>Current Balance</th>
                            <th>Remark</th>
                            <th>Updated By</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(transactions || []).length > 0 ? (
                            transactions.map((transaction) => (
                                <tr key={transaction.transaction_id}>
                                    <td>{transaction.transaction_id}</td>
                                    <td>{parseFloat(transaction.amount).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${transaction.type.toLowerCase()}`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td>{transaction.bill_number}</td>
                                    <td>{parseFloat(transaction.current_balance).toLocaleString()}</td>
                                    <td>{transaction.remark}</td>
                                    <td>{transaction.updated_by}</td>
                                    <td>{transaction.created_at}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                                    {transactionError || "No transactions available"}
                                </td>
                            </tr>
                        )}
                    </tbody>


                </table>
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Add New Expense</h3>
                        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} />
                        <select name="type" value={formData.type} onChange={handleInputChange}>
                            <option value="debit">Debit</option>
                            <option value="credit">Credit</option>
                        </select>
                        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} />
                        <select name="type" value={formData.payment_method} onChange={handleInputChange}>
                            <option value="cash">CASH</option>
                            <option value="upi">UPI</option>
                            <option value="bank">BANK</option>
                        </select>
                        <input type="text" name="remark" placeholder="Remark" value={formData.remark} onChange={handleInputChange} />
                        <button onClick={handleSubmit}>Submit</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {isOpen && (
                <div className="bank_modal-overlay">
                    <div className="bank_modal">
                        <h3>Today's Credit Summary</h3>
                        <div className="credit-summary">
                            <p><strong>Total:</strong> ₹{totalAmount.toFixed(2)}</p>
                            <p><strong>Cash:</strong> ₹{totalCredits.cash.toFixed(2)}</p>
                            <p><strong>Bank:</strong> ₹{totalCredits.bank.toFixed(2)}</p>
                            <p><strong>UPI:</strong> ₹{totalCredits.upi.toFixed(2)}</p>
                        </div>
                        <div className="input-group">
                            <label htmlFor="balance-amount">Balance:</label>
                            <input
                                type="number"
                                id="closing-amount"
                                value={totalCredits.balance}
                                // onChange={(e) => setClosingAmount(e.target.value)}
                                // placeholder="e.g. 11000.00"
                                readOnly
                            />
                            <label htmlFor="closing-amount">Enter Closing Amount:</label>
                            <input
                                type="number"
                                id="closing-amount"
                                value={closingAmount}
                                onChange={(e) => setClosingAmount(e.target.value)}
                                placeholder="e.g. 11000.00"
                            />
                        </div>
                        <label htmlFor="closing-remark">Enter Remark:</label>
                        <input
                            type="text"
                            id="closing-remark"
                            value={closingremark}
                            onChange={(e) => setClosingremark(e.target.value)}
                            placeholder="e.g. bank closing "
                        />
                        <div className="modal-buttons">
                            <button onClick={() => setIsOpen(false)} className="cancel-btn">
                                Cancel
                            </button>
                            <button onClick={handleSubmitclosing} className="confirm-btn">
                                Submit Closing
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isOpenhistory && (
                <div className="reportmodal-overlay">
                    <div className="reportmodal-content">
                        <button className="r-close-btn" onClick={() => setIsOpenhistory(false)}>X</button>

                        <h2>Bank Closing History</h2>

                        {/* Grouping toggle */}
                        <div className='r-btns'>
                            <button onClick={() => handleGroupToggle('day')}>Day</button>
                            <button onClick={() => handleGroupToggle('month')}>Month</button>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Cash</th>
                                        <th>UPI</th>
                                        <th>Bank</th>
                                        <th>Total</th>
                                        <th>Closed</th>
                                        <th>Balance</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item.period}>
                                            <td>{item.period}</td>
                                            <td>₹{item.cash.toFixed(2)}</td>
                                            <td>₹{item.upi.toFixed(2)}</td>
                                            <td>₹{item.bank.toFixed(2)}</td>
                                            <td>₹{item.total_credit.toFixed(2)}</td>
                                            <td>₹{item.closed_amount.toFixed(2)}</td>
                                            <td>₹{item.balance.toFixed(2)}</td>
                                            <td>
                                                {/* Show the Close Balance button only for "day" grouping */}
                                                {groupBy === 'day' && item.balance > 0 ? (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPeriod(item.period);
                                                            setClosingAmount(item.balance);
                                                            setIsClosePopupOpen(true);
                                                        }}
                                                    >
                                                        Close Balance
                                                    </button>

                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>
            )}
            {isClosePopupOpen && (
                <div className="modal-overlay">
                    <div className="reportmodal-content">
                        <h3>Add Closing Balance</h3>
                        <p><strong>Date:</strong> {selectedPeriod}</p>

                        <label>
                            Balance Amount:
                            <input
                                type="number"
                                value={closingAmount}
                                // onChange={(e) => setClosingAmount(parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                                readyonly
                            />
                        </label>
                        <label>
                            Closing Amount:
                            <input
                                type="number"
                                value={closingAmountbalance}

                                onChange={(e) => setClosingbalanceAmount(parseFloat(e.target.value) || 0)}
                            // step="0.01"
                            // min="0"
                            />
                        </label>

                        <div style={{ marginTop: "15px" }}>
                            <button
                                onClick={() => {
                                    handleCloseBalance(selectedPeriod, closingAmountbalance);
                                    setIsClosePopupOpen(false);
                                }}
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setIsClosePopupOpen(false)}
                                style={{ backgroundColor: '#ccc', marginLeft: '10px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Account;
