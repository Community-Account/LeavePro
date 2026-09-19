import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiCalendar, FiClock, FiUser, FiInfo } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import StatusBadge from '../components/StatusBadge';
import LeaveTypeBadge from '../components/LeaveTypeBadge';
import { formatDate } from '../utils/leaveUtils';
import profileImg from '../assets/profile.jpg';
import './LeaveDetails.css';

export const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isManager } = useAuth();
  const { leaveRequests, leaveTypes, users, departments, approveRequest, rejectRequest } = useLeaves();

  const request = leaveRequests.find(r => String(r.id) === String(id));
  const employee = request ? users.find(u => String(u.id) === String(request.employee_id)) : null;
  const leaveType = request ? leaveTypes.find(lt => String(lt.id) === String(request.leave_type_id)) : null;
  const department = employee ? departments.find(d => String(d.id) === String(employee.department_id)) : null;

  const handleBack = () => {
    if (isManager) {
      navigate('/leave-requests');
    } else {
      navigate('/leave-history');
    }
  };

  const handleApprove = async () => {
    await approveRequest(request.id, user?.name || 'Manager');
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this leave request?')) {
      await rejectRequest(request.id, user?.name || 'Manager');
    }
  };

  if (!request) {
    return (
      <div className="leave-details-container">
        <div className="details-top-bar">
          <button type="button" className="btn-secondary" onClick={handleBack}>
            <FiArrowLeft /> Back to List
          </button>
        </div>
        <div className="details-card-main">
          <div className="details-grid">
            <p>Leave request not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const isPending = request.status === 'Pending';

  return (
    <div className="leave-details-container">
      <div className="details-top-bar">
        <button type="button" className="btn-secondary" onClick={handleBack}>
          <FiArrowLeft /> Back
        </button>
        <div className="welcome-text-group">
          <StatusBadge status={request.status} />
        </div>
      </div>

      <div className="details-card-main">
        <div className="details-card-header">
          <div className="employee-large-profile">
            <img src={profileImg} alt={employee?.name || 'Employee'} className="employee-large-avatar" />
            <div className="employee-large-info">
              <h2 className="employee-large-name">{employee?.name || 'Unknown Employee'}</h2>
              <p className="employee-large-sub">
                {employee?.role?.toUpperCase()} • {department?.name || 'General'} • {employee?.email}
              </p>
            </div>
          </div>
          <div>
            <LeaveTypeBadge code={leaveType?.code} name={leaveType?.name} />
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Leave Type</span>
            <span className="detail-value">{leaveType?.name} ({leaveType?.code})</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Duration / Total Days</span>
            <span className="detail-value">{request.total_days} {request.total_days === 1 || request.total_days === 0.5 ? 'Day' : 'Days'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Date Range</span>
            <span className="detail-value">{formatDate(request.start_date)} — {formatDate(request.end_date)}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Application Date</span>
            <span className="detail-value">{formatDate(request.created_at)}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Approved By</span>
            <span className="detail-value">
              {request.approved_by ? `${request.approved_by} (${request.status})` : 'Pending Decision'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Last Updated</span>
            <span className="detail-value">{formatDate(request.updated_at || request.created_at)}</span>
          </div>

          <div className="reason-box-full">
            <span className="detail-label">Reason for Leave</span>
            <p className="reason-text">{request.reason}</p>
          </div>
        </div>

        {isManager && isPending && (
          <div className="details-action-bar">
            <button
              type="button"
              className="btn-success"
              onClick={handleApprove}
            >
              <FiCheck /> Approve Request
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={handleReject}
            >
              <FiX /> Reject Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetails;
