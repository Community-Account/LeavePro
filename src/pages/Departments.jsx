import React, { useState } from 'react';
import { FiLayers, FiChevronDown, FiUsers } from 'react-icons/fi';
import { useLeaves } from '../hooks/useLeaves';
import { formatDate } from '../utils/leaveUtils';
import profileImg from '../assets/profile.jpg';
import './Departments.css';

export const Departments = () => {
  const { departments, users } = useLeaves();
  const [expandedDepts, setExpandedDepts] = useState({ '1': true });

  const toggleDept = (id) => {
    setExpandedDepts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getMembers = (deptId) => {
    return users.filter(u => String(u.department_id) === String(deptId));
  };

  return (
    <div className="departments-page-container">
      <div className="departments-header-bar">
        <div className="welcome-text-group">
          <h2 className="welcome-heading">Company Departments</h2>
          <p className="welcome-subheading">Manage and review organization departments and their assigned team members.</p>
        </div>
      </div>

      <div className="departments-list">
        {departments.map(dept => {
          const members = getMembers(dept.id);
          const isExpanded = !!expandedDepts[dept.id];

          return (
            <div
              key={dept.id}
              className={`department-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className="department-card-header"
                onClick={() => toggleDept(dept.id)}
              >
                <div className="dept-header-left">
                  <div className="dept-icon-box">
                    <FiLayers />
                  </div>
                  <div className="dept-title-group">
                    <h3 className="dept-title">{dept.name}</h3>
                    <span className="dept-created-date">Created on {formatDate(dept.created_at)}</span>
                  </div>
                </div>

                <div className="dept-header-right">
                  <span className="employee-count-pill">
                    <FiUsers /> {members.length} {members.length === 1 ? 'Member' : 'Members'}
                  </span>
                  <FiChevronDown className="expand-chevron-icon" />
                </div>
              </div>

              {isExpanded && (
                <div className="department-members-drawer">
                  <h5 className="members-section-title">Department Members</h5>
                  {members.length === 0 ? (
                    <p className="empty-members-msg">No employees assigned to this department yet.</p>
                  ) : (
                    <div className="members-grid">
                      {members.map(member => (
                        <div key={member.id} className="member-mini-card">
                          <img src={profileImg} alt={member.name} className="member-mini-avatar" />
                          <div className="member-mini-details">
                            <span className="member-mini-name">{member.name}</span>
                            <span className="member-mini-role">{member.role}</span>
                            <span className="member-mini-email">{member.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;
