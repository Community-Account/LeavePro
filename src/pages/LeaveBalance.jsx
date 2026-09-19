import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiInfo } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import LeaveTypeBadge from '../components/LeaveTypeBadge';
import { calculateLeaveBalances } from '../utils/leaveUtils';
import './LeaveBalance.css';

export const LeaveBalance = () => {
  const { user } = useAuth();
  const { leaveTypes, leaveRequests } = useLeaves();

  const balances = calculateLeaveBalances(leaveTypes, leaveRequests, user?.id);

  const policyDescriptions = {
    CL: 'Casual Leave covers unexpected short-term personal circumstances or urgent tasks.',
    SL: 'Sick Leave is dedicated to medical recovery, doctor visits, and personal health.',
    EL: 'Earned Leave is designated for extended annual vacation and personal rejuvenation.',
    PL: 'Privilege Leave provides additional sanctioned time-off based on company tenure.'
  };

  return (
    <div className="leave-balance-page-container">
      <div className="balance-header-bar">
        <div className="welcome-text-group">
          <h2 className="welcome-heading">Leave Balance</h2>
          <p className="welcome-subheading">Track your annual leave quotas, consumed leaves, and remaining balance.</p>
        </div>
        <Link to="/apply-leave" className="btn-primary">
          <FiPlusCircle /> Apply Leave
        </Link>
      </div>

      <div className="balance-grid-cards">
        {balances.map(b => (
          <LeaveBalanceCard
            key={b.id}
            name={b.name}
            code={b.code}
            used={b.used}
            annualLimit={b.annual_limit}
            remaining={b.remaining}
          />
        ))}
      </div>

      <div className="balance-info-alert">
        <FiInfo className="info-alert-icon" />
        <span>Leave balance will be updated after approval of your leave request.</span>
      </div>

      <div className="balance-policy-section">
        <h3 className="policy-section-heading">Leave Balance Policy</h3>
        <div className="policy-cards-row">
          {leaveTypes.map(lt => (
            <div key={lt.id} className="policy-detail-card">
              <div className="policy-card-top">
                <LeaveTypeBadge code={lt.code} name={lt.name} />
                <span className="policy-limit-text">{lt.annual_limit} days / year</span>
              </div>
              <p className="policy-card-desc">
                {policyDescriptions[lt.code] || `${lt.name} allows up to ${lt.annual_limit} days annually.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;
