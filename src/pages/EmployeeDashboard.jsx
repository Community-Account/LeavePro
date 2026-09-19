import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiPieChart, FiClock, FiPlusCircle, FiList } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import LeaveCard from '../components/LeaveCard';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import LeaveTable from '../components/LeaveTable';
import { calculateLeaveBalances, calculateDashboardStats } from '../utils/leaveUtils';
import './EmployeeDashboard.css';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { leaveRequests, leaveTypes, users, loading } = useLeaves();

  const myRequests = leaveRequests.filter(r => String(r.employee_id) === String(user?.id));
  const stats = calculateDashboardStats(leaveTypes, leaveRequests, user?.id);
  const balances = calculateLeaveBalances(leaveTypes, leaveRequests, user?.id);
  const recentRequests = [...myRequests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome-bar">
        <div className="welcome-text-group">
          <h2 className="welcome-heading">Welcome back, {user?.name || 'Employee'}!</h2>
          <p className="welcome-subheading">Here is an overview of your leave status and requests for this year.</p>
        </div>
        <div className="welcome-quick-actions">
          <Link to="/apply-leave" className="btn-primary">
            <FiPlusCircle /> Apply Leave
          </Link>
          <Link to="/leave-history" className="btn-secondary">
            <FiList /> View Leave History
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <LeaveCard
          title="Total Leaves"
          value={stats.totalLeaves}
          icon={<FiCalendar />}
          color="blue"
        />
        <LeaveCard
          title="Used Leaves"
          value={stats.usedLeaves}
          icon={<FiCheckCircle />}
          color="orange"
        />
        <LeaveCard
          title="Remaining Leaves"
          value={stats.remainingLeaves}
          icon={<FiPieChart />}
          color="green"
        />
        <LeaveCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<FiClock />}
          color="purple"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header-row">
          <h3 className="section-title">Leave Balance (Current Year)</h3>
          <Link to="/leave-balance" className="section-view-all">Detailed Breakdown &rarr;</Link>
        </div>
        <div className="balance-cards-grid">
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
      </div>

      <div className="dashboard-section">
        <div className="section-header-row">
          <h3 className="section-title">Recent Leave Requests</h3>
          <Link to="/leave-history" className="section-view-all">View All History &rarr;</Link>
        </div>
        <LeaveTable
          data={recentRequests}
          users={users}
          leaveTypes={leaveTypes}
          showEmployee={false}
          showAppliedOn={true}
          showActions={true}
          isManager={false}
          itemsPerPage={5}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
