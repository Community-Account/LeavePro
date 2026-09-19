import React from 'react';
import './LeaveTypeBadge.css';

export const LeaveTypeBadge = ({ code, name }) => {
  const codeNormalized = (code || '').toLowerCase();
  return (
    <span className={`leave-type-badge ${codeNormalized || 'default'}`} title={name}>
      {code || name || 'LEAVE'}
    </span>
  );
};

export default LeaveTypeBadge;
