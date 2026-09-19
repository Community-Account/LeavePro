import React, { useState } from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import LeaveTable from '../components/LeaveTable';
import './LeaveRequests.css';

export const LeaveRequests = () => {
  const { user } = useAuth();
  const { leaveRequests, leaveTypes, users, approveRequest, rejectRequest, fetchAllData } = useLeaves();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleApprove = (id) => {
    approveRequest(id, user?.name || 'Manager');
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this leave request?')) {
      rejectRequest(id, user?.name || 'Manager');
    }
  };

  const getUser = (employeeId) => {
    return users.find(u => String(u.id) === String(employeeId));
  };

  const getLeaveType = (typeId) => {
    return leaveTypes.find(lt => String(lt.id) === String(typeId));
  };

  const filteredRequests = leaveRequests.filter(r => {
    const u = getUser(r.employee_id);
    const lt = getLeaveType(r.leave_type_id);
    const employeeName = u ? u.name.toLowerCase() : '';
    const leaveTypeName = lt ? lt.name.toLowerCase() : '';
    const leaveTypeCode = lt ? lt.code.toLowerCase() : '';
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = !q || employeeName.includes(q) || leaveTypeName.includes(q) || leaveTypeCode.includes(q);
    const matchesStatus = selectedStatus === 'All' || r.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="leave-requests-page-container">
      <div className="requests-header-bar">
        <div className="welcome-text-group">
          <h2 className="welcome-heading">Leave Applications</h2>
          <p className="welcome-subheading">Review, approve, or reject employee leave requests across all departments.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => fetchAllData()}>
          <FiRefreshCw /> Refresh Data
        </button>
      </div>

      <div className="requests-filter-card">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by employee name or leave type (e.g. CL, Piyush)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label" htmlFor="status-select">Status Filter:</label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Requests ({leaveRequests.length})</option>
              <option value="Pending">Pending ({leaveRequests.filter(r => r.status === 'Pending').length})</option>
              <option value="Approved">Approved ({leaveRequests.filter(r => r.status === 'Approved').length})</option>
              <option value="Rejected">Rejected ({leaveRequests.filter(r => r.status === 'Rejected').length})</option>
            </select>
          </div>

          {(searchQuery || selectedStatus !== 'All') && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <LeaveTable
        data={filteredRequests}
        users={users}
        leaveTypes={leaveTypes}
        showEmployee={true}
        showAppliedOn={true}
        showActions={true}
        isManager={true}
        onApprove={handleApprove}
        onReject={handleReject}
        itemsPerPage={6}
      />
    </div>
  );
};

export default LeaveRequests;
