import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import LeaveTable from '../components/LeaveTable';
import './LeaveHistory.css';

export const LeaveHistory = () => {
  const { user } = useAuth();
  const { leaveRequests, leaveTypes, users } = useLeaves();

  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const myRequests = leaveRequests.filter(r => String(r.employee_id) === String(user?.id));

  const filteredRequests = myRequests.filter(r => {
    const matchesType = selectedType === 'All' || String(r.leave_type_id) === String(selectedType);
    const matchesStatus = selectedStatus === 'All' || r.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesType && matchesStatus;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleResetFilters = () => {
    setSelectedType('All');
    setSelectedStatus('All');
  };

  return (
    <div className="leave-history-container">
      <div className="history-header-bar">
        <div className="welcome-text-group">
          <h2 className="welcome-heading">My Leave History</h2>
          <p className="welcome-subheading">View all your previous and active leave applications and their statuses.</p>
        </div>
        <Link to="/apply-leave" className="btn-primary">
          <FiPlusCircle /> Apply Leave
        </Link>
      </div>

      <div className="filter-bar-card">
        <div className="filter-group">
          <label className="filter-label" htmlFor="type-filter">Leave Type:</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Types</option>
            {leaveTypes.map(lt => (
              <option key={lt.id} value={lt.id}>{lt.name} ({lt.code})</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {(selectedType !== 'All' || selectedStatus !== 'All') && (
          <button
            type="button"
            className="clear-filter-btn"
            onClick={handleResetFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <LeaveTable
        data={filteredRequests}
        users={users}
        leaveTypes={leaveTypes}
        showEmployee={false}
        showAppliedOn={true}
        showActions={true}
        isManager={false}
        itemsPerPage={6}
      />
    </div>
  );
};

export default LeaveHistory;
