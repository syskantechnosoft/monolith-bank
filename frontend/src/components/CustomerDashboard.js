import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api';

export default function CustomerDashboard({ token, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payees, setPayees] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('accounts');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [accountType, setAccountType] = useState('SAVINGS');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API}/accounts/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load accounts');
      setAccounts([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API}/transactions/search`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load transactions');
      setTransactions([]);
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    if (!initialDeposit || parseFloat(initialDeposit) <= 0) {
      setError('Initial deposit must be positive');
      return;
    }
    try {
      await axios.post(
        `${API}/accounts`,
        {
          accountType,
          initialDeposit: parseFloat(initialDeposit),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${accountType} account created successfully${accountType === 'LOAN' ? ' (pending admin approval)' : ''}`);
      setShowCreateForm(false);
      setAccountType('SAVINGS');
      setInitialDeposit('');
      setError('');
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
  };

  const handleDeposit = async (accountNumber) => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Amount must be positive');
      return;
    }
    try {
      await axios.post(`${API}/transactions/deposit`, null, {
        params: { accountNumber, amount: parseFloat(depositAmount) },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      setDepositAmount('');
      setError('');
      alert('Deposit successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (accountNumber) => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setError('Amount must be positive');
      return;
    }
    try {
      await axios.post(`${API}/transactions/withdraw`, null, {
        params: { accountNumber, amount: parseFloat(withdrawAmount) },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      setWithdrawAmount('');
      setError('');
      alert('Withdraw successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Withdraw failed');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferFrom || !transferTo || !transferAmount) {
      setError('All fields required');
      return;
    }
    if (parseFloat(transferAmount) <= 0) {
      setError('Amount must be positive');
      return;
    }
    try {
      await axios.post(`${API}/transactions/transfer`, null, {
        params: {
          fromAccount: transferFrom,
          toAccount: transferTo,
          amount: parseFloat(transferAmount),
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      setTransferFrom('');
      setTransferTo('');
      setTransferAmount('');
      setError('');
      alert('Transfer successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
  };

  const addPayee = (payee) => {
    setPayees([...payees, payee]);
  };

  const buttonStyle = {
    padding: '8px 16px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
  };

  const tabButtonStyle = (isActive) => ({
    ...buttonStyle,
    backgroundColor: isActive ? '#007bff' : '#6c757d',
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Customer Dashboard</h2>
        <button
          onClick={onLogout}
          style={{ ...buttonStyle, backgroundColor: '#d9534f' }}
        >
          Logout
        </button>
      </div>

      {error && (
        <div style={{ color: '#721c24', padding: '12px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '15px', border: '1px solid #f5c6cb' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('accounts')} style={tabButtonStyle(activeTab === 'accounts')}>
          Accounts
        </button>
        <button
          onClick={() => {
            setActiveTab('transactions');
            fetchTransactions();
          }}
          style={tabButtonStyle(activeTab === 'transactions')}
        >
          Transactions
        </button>
        <button onClick={() => setActiveTab('payees')} style={tabButtonStyle(activeTab === 'payees')}>
          Payees
        </button>
      </div>

      {activeTab === 'accounts' && (
        <div>
          <h3>Your Accounts</h3>

          {accounts.length > 0 ? (
            <div style={{ marginBottom: '30px' }}>
              {accounts.map((acct) => (
                <div
                  key={acct.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    marginBottom: '15px',
                    borderRadius: '4px',
                    backgroundColor: acct.type === 'LOAN' && !acct.approved ? '#fff3cd' : '#f9f9f9',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{acct.accountNumber}</h4>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Type:</strong> {acct.type}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Balance:</strong> ${acct.balance.toFixed(2)}
                  </p>
                  {acct.type === 'LOAN' && (
                    <p style={{ margin: '5px 0', color: acct.approved ? '#155724' : '#ff9800' }}>
                      <strong>Status:</strong> {acct.approved ? '✓ Approved' : '⏳ Pending Admin Approval'}
                    </p>
                  )}

                  <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                        Deposit Amount:
                      </label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <button
                          onClick={() => handleDeposit(acct.accountNumber)}
                          style={{ ...buttonStyle, backgroundColor: '#28a745', marginRight: '0' }}
                        >
                          Deposit
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                        Withdraw Amount:
                      </label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <button
                          onClick={() => handleWithdraw(acct.accountNumber)}
                          style={{ ...buttonStyle, backgroundColor: '#dc3545', marginRight: '0' }}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>No accounts yet. Create one below!</p>
          )}

          {/* Create Account Form */}
          <div
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              marginBottom: '20px',
            }}
          >
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                style={{ ...buttonStyle, backgroundColor: '#28a745', marginRight: '0' }}
              >
                + Create New Account
              </button>
            ) : (
              <form onSubmit={createAccount}>
                <h4>Create New Account</h4>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Account Type:
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="SAVINGS">Savings Account</option>
                    <option value="CURRENT">Current Account</option>
                    <option value="DEPOSIT">Fixed Deposit</option>
                    <option value="LOAN">Loan</option>
                  </select>
                  {accountType === 'LOAN' && (
                    <p style={{ fontSize: '12px', color: '#ff9800', marginTop: '5px', fontStyle: 'italic' }}>
                      ⓘ Loan accounts require admin approval to be activated
                    </p>
                  )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Initial Deposit:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    required
                    style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    style={{ ...buttonStyle, backgroundColor: '#007bff' }}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setAccountType('SAVINGS');
                      setInitialDeposit('');
                    }}
                    style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Fund Transfer Form */}
          <div
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h4>Fund Transfer</h4>
            <form onSubmit={handleTransfer}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  From Account:
                </label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  required
                  style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  To Account:
                </label>
                <input
                  type="text"
                  placeholder="Enter recipient account"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  required
                  style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Amount:
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                  style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <button type="submit" style={{ ...buttonStyle, backgroundColor: '#17a2b8', marginRight: '0' }}>
                Transfer Funds
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div>
          <h3>Transaction History</h3>
          {transactions && transactions.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '10px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Account</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} style={{ borderBottom: '1px solid #ddd', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{txn.id}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{txn.account?.accountNumber || 'N/A'}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{txn.transactionType}</td>
                      <td
                        style={{
                          padding: '12px',
                          border: '1px solid #ddd',
                          textAlign: 'right',
                          color: txn.debit ? '#dc3545' : '#28a745',
                          fontWeight: 'bold',
                        }}
                      >
                        {txn.debit ? '−' : '+'}${txn.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {new Date(txn.transactionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No transactions found.</p>
          )}
        </div>
      )}

      {activeTab === 'payees' && (
        <div>
          <h3>Payee Management</h3>
          {payees.length > 0 ? (
            <div style={{ marginBottom: '20px' }}>
              {payees.map((payee, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f9f9f9',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                >
                  <strong>{payee.name}</strong> - {payee.account}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>No payees saved yet.</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addPayee({ name: e.target.name.value, account: e.target.account.value });
              e.target.reset();
            }}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h4>Add New Payee</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Payee Name:
              </label>
              <input
                name="name"
                placeholder="Enter payee name"
                required
                style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Account Number:
              </label>
              <input
                name="account"
                placeholder="Enter account number"
                required
                style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#28a745', marginRight: '0' }}>
              Add Payee
            </button>
          </form>
        </div>
      )}
    </div>
  );
}