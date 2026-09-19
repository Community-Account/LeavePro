import React from 'react';
import './LeaveCard.css';

export const LeaveCard = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className="leave-stat-card">
      <div className={`stat-icon-wrapper ${color}`}>
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{title}</span>
      </div>
    </div>
  );
};

export default LeaveCard;
