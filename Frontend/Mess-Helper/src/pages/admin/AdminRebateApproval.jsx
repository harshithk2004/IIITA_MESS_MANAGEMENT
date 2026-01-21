import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/AdminRebateApproval.module.css';

const AdminRebateApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/rebate-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Apply filter
      let filteredRequests = response.data;
      if (filter === 'approved') {
        filteredRequests = response.data.filter(req => req.status === 'Yes');
      } else if (filter === 'pending') {
        filteredRequests = response.data.filter(req => req.status === 'No');
      }
      
      setRequests(filteredRequests);
      setError(null);
    } catch (err) {
      setError('Failed to load rebate requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/rebate-requests/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setRequests(requests.map(request => 
        request.id === id ? { ...request, status: newStatus } : request
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mess Rebate Approval</h1>
      
      {/* Filter controls */}
      <div className={styles.filterControls}>
        <button
          onClick={() => setFilter('all')}
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterActive : ''}`}
        >
          All Requests
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`${styles.filterButton} ${filter === 'approved' ? styles.filterApprovedActive : ''}`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`${styles.filterButton} ${filter === 'pending' ? styles.filterPendingActive : ''}`}
        >
          Pending
        </button>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div className={styles.errorAlert}>
          <p>{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className={styles.emptyAlert}>
          <p>No rebate requests found.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Student</th>
                <th className={styles.tableHeaderCell}>Details</th>
                <th className={styles.tableHeaderCell}>Dates</th>
                <th className={styles.tableHeaderCell}>Submitted By</th>
                <th className={styles.tableHeaderCell}>Status</th>
                <th className={styles.tableHeaderCell}>Action</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {requests.map((request) => (
                <tr key={request.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.studentName}>{request.name}</div>
                    <div className={styles.studentEnroll}>{request.enroll}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.studentDetail}>{request.branch}</div>
                    <div className={styles.studentDetailSecondary}>{request.hostel}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.dateRange}>
                      {request.start_date} to {request.end_date}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.submittedBy}>{request.submitted_by}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${
                      request.status === 'Yes' ? styles.statusApproved : styles.statusPending
                    }`}>
                      {request.status === 'Yes' ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {request.status === 'No' ? (
                      <button
                        onClick={() => handleStatusChange(request.id, 'Yes')}
                        className={styles.approveButton}
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(request.id, 'No')}
                        className={styles.rejectButton}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRebateApproval;