import React from 'react';
import LeaveTypeBadge from './LeaveTypeBadge';
import './LeaveBalanceCard.css';

export const LeaveBalanceCard = ({ name, code, used, annualLimit, remaining }) => {
  const codeNormalized = (code || '').toLowerCase();
  const safeLimit = Number(annualLimit) || 1;
  const safeUsed = Number(used) || 0;
  const percentage = Math.min(100, Math.max(0, Math.round((safeUsed / safeLimit) * 100)));
  const roundedStep = Math.round(percentage / 5) * 5;
  const widthClass = `w-${roundedStep}`;

  return (
    <div className="leave-balance-card">
      <div className="leave-balance-header">
        <div className="leave-balance-title-group">
          <LeaveTypeBadge code={code} name={name} />
          <h4 className="leave-balance-title">{name}</h4>
        </div>
        <div className="leave-balance-ratio">
          <span className="leave-balance-ratio-used">{safeUsed}</span> / {safeLimit}
        </div>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${codeNormalized || 'default'} ${widthClass}`} />
      </div>
      <div className="leave-balance-footer">
        <span>Remaining: <strong className="remaining-count">{remaining ?? Math.max(0, safeLimit - safeUsed)}</strong> days</span>
        <span>{percentage}% used</span>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
