import React, { useState } from 'react';
import './feepayment.css';

const FeePaymentPage = () => {
  const installments = [
    { id: 1, dueDate: '2025-07-01', amount: 5000, status: 'Paid' },
    { id: 2, dueDate: '2025-08-01', amount: 5000, status: 'Paid' },
    { id: 3, dueDate: '2025-09-01', amount: 5000, status: 'Unpaid' },
    { id: 4, dueDate: '2025-10-01', amount: 5000, status: 'Unpaid' },
    { id: 5, dueDate: '2025-11-01', amount: 5000, status: 'Unpaid' },
  ];

  const [history] = useState([
    { date: '2025-07-01', amount: 5000, method: 'UPI' },
    { date: '2025-08-01', amount: 5000, method: 'Credit Card' },
  ]);

  const balance = installments
    .filter((i) => i.status === 'Unpaid')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="feepayment-container">
      <div className="feepayment-inner">
        <h2 className="feepayment-title">Fee Installments</h2>
        <div className="feepayment-installment-list">
          {installments.map((inst) => (
            <div
              key={inst.id}
              className={`feepayment-installment ${
                inst.status === 'Paid' ? 'paid' : ''
              }`}
            >
              <div>
                <h4>Installment {inst.id}</h4>
                <p>Due: {inst.dueDate}</p>
              </div>
              <div className="feepayment-installment-right">
                <p>₹{inst.amount}</p>
                <span
                  className={`feepayment-status ${
                    inst.status === 'Paid' ? 'paid' : 'unpaid'
                  }`}
                >
                  {inst.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="feepayment-section">
          <h2 className="feepayment-title">Remaining Balance</h2>
          <div className="feepayment-balance-box">₹{balance}</div>
        </div>

        <div className="feepayment-section">
          <h2 className="feepayment-title">Payment History</h2>
          <div className="feepayment-table-container">
            <table className="feepayment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, idx) => (
                  <tr key={idx}>
                    <td>{h.date}</td>
                    <td>₹{h.amount}</td>
                    <td>{h.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="feepayment-bottom-bar">
        <button className="feepayment-button">Make Payment</button>
      </div>
    </div>
  );
};

export default FeePaymentPage;
