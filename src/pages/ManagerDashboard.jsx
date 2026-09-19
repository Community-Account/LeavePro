import React from 'react';
import { Link } from 'react-router-dom';
import { FiInbox, FiClock, FiCheckCircle, FiUsers, FiClipboard } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import LeaveCard from '../components/LeaveCard';
import LeaveTable from '../components/LeaveTable';
import './ManagerDashboard.css';

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const { leaveRequests, leaveTypes, users, approveRequest, rejectRequest } = useLeaves();

  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(r => r.status === 'Pending');
  const approvedRequests = leaveRequests.filter(r => r.status === 'Approved').length;
  const totalEmployees = users.filter(u => u.role === 'employee').length;

  const handleApprove = (id) => {
    approveRequest(id, user?.name || 'Manager');
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this leave request?')) {
      rejectRequest(id, user?.name || 'Manager');
    }
  };

  return (
    <div className="manager-dashboard-container">
      <div className="manager-welcome-bar">
        <div className="welcome-text-group">
          <h2 className="welcome-heading">Manager Overview, {user?.name}!</h2>
          <p className="welcome-subheading">Manage leave requests, review employee attendance, and process pending approvals.</p>
        </div>
        <div className="welcome-quick-actions">
          <Link to="/leave-requests" className="btn-primary">
            <FiClipboard /> All Leave Requests
          </Link>
          <Link to="/employees" className="btn-secondary">
            <FiUsers /> View Employees
          </Link>
        </div>
      </div>

      <div className="manager-stats-grid">
        <LeaveCard
          title="Total Requests"
          value={totalRequests}
          icon={<FiInbox />}
          color="blue"
        />
        <LeaveCard
          title="Pending Approvals"
          value={pendingRequests.length}
          icon={<FiClock />}
          color="yellow"
        />
        <LeaveCard
          title="Approved Requests"
          value={approvedRequests}
          icon={<FiCheckCircle />}
          color="green"
        />
        <LeaveCard
          title="Total Employees"
          value={totalEmployees}
          icon={<FiUsers />}
          color="purple"
        />
      </div>

      <div className="manager-section">
        <div className="manager-section-header">
          <div className="welcome-text-group">
            <h3 className="manager-section-title">Pending Requests Requiring Action</h3>
          </div>
          {pendingRequests.length > 0 && (
            <span className="pending-alert-badge">{pendingRequests.length} Pending</span>
          )}
        </div>
        <LeaveTable
          data={pendingRequests}
          users={users}
          leaveTypes={leaveTypes}
          showEmployee={true}
          showAppliedOn={true}
          showActions={true}
          isManager={true}
          onApprove={handleApprove}
          onReject={handleReject}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
