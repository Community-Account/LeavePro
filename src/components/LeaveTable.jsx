import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import LeaveTypeBadge from './LeaveTypeBadge';
import { formatDate } from '../utils/leaveUtils';
import profileImg from '../assets/profile.jpg';
import './LeaveTable.css';

export const LeaveTable = ({
  data = [],
  users = [],
  leaveTypes = [],
  showEmployee = true,
  showAppliedOn = true,
  showActions = true,
  isManager = false,
  onApprove = null,
  onReject = null,
  itemsPerPage = 5
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getUser = (employeeId) => {
    return users.find(u => String(u.id) === String(employeeId)) || { name: 'Unknown', role: 'Employee' };
  };

  const getLeaveType = (typeId) => {
    return leaveTypes.find(lt => String(lt.id) === String(typeId)) || { code: 'CL', name: 'Leave' };
  };

  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (data.length === 0) {
    return (
      <div className="leave-table-card">
        <div className="empty-table-state">
          <p className="empty-table-title">No leave requests found</p>
          <p className="empty-table-desc">Try changing the search or filter settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leave-table-card">
      <div className="table-responsive-wrapper">
        <table className="leave-data-table">
          <thead>
            <tr>
              <th>#</th>
              {showEmployee && <th>Employee</th>}
              <th>Leave Type</th>
              <th>Date Range</th>
              <th>Days</th>
              <th>Status</th>
              {showAppliedOn && <th>Applied On</th>}
              {showActions && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const user = getUser(item.employee_id);
              const leaveType = getLeaveType(item.leave_type_id);
              const isPending = item.status === 'Pending';

              return (
                <tr key={item.id}>
                  <td>{startIndex + index + 1}</td>
                  {showEmployee && (
                    <td>
                      <div className="employee-cell">
                        <img src={profileImg} alt={user.name} className="employee-avatar-circle" />
                        <div className="employee-cell-meta">
                          <span className="employee-cell-name">{user.name}</span>
                          <span className="employee-cell-role">{user.role}</span>
                        </div>
                      </div>
                    </td>
                  )}
                  <td>
                    <LeaveTypeBadge code={leaveType.code} name={leaveType.name} />
                  </td>
                  <td>
                    {formatDate(item.start_date)} - {formatDate(item.end_date)}
                  </td>
                  <td>
                    <strong>{item.total_days}</strong> {item.total_days === 1 || item.total_days === 0.5 ? 'day' : 'days'}
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  {showAppliedOn && (
                    <td>{formatDate(item.created_at)}</td>
                  )}
                  {showActions && (
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/leave-requests/${item.id}`}
                          className="action-btn action-btn-view"
                          title="View Details"
                        >
                          <FiEye /> View
                        </Link>

                        {isManager && isPending && (
                          <>
                            <button
                              className="action-btn action-btn-approve"
                              onClick={() => onApprove && onApprove(item.id)}
                              title="Approve Leave"
                            >
                              <FiCheck /> Approve
                            </button>
                            <button
                              className="action-btn action-btn-reject"
                              onClick={() => onReject && onReject(item.id)}
                              title="Reject Leave"
                            >
                              <FiX /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries
          </div>
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTable;
