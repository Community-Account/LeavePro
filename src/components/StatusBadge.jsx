import React from 'react';
import './StatusBadge.css';

export const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || 'Pending').toLowerCase();
  return (
    <span className={`status-badge ${normalizedStatus}`}>
      {status || 'Pending'}
    </span>
  );
};

export default StatusBadge;
