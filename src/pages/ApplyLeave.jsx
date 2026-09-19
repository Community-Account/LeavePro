import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiRotateCcw, FiSend, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import { calculateTotalDays, calculateLeaveBalances } from '../utils/leaveUtils';
import { validateApplyLeave } from '../utils/validation';
import LeaveTypeBadge from '../components/LeaveTypeBadge';
import './ApplyLeave.css';

export const ApplyLeave = () => {
  const { user } = useAuth();
  const { leaveTypes, leaveRequests, applyLeave } = useLeaves();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    is_half_day: false
  });

  const [calculatedDays, setCalculatedDays] = useState(0);
  const [errors, setErrors] = useState({});
  const [softWarning, setSoftWarning] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balances = calculateLeaveBalances(leaveTypes, leaveRequests, user?.id);

  const selectedBalance = balances.find(b => String(b.id) === String(formData.leave_type_id));

  useEffect(() => {
    const days = calculateTotalDays(formData.start_date, formData.end_date, formData.is_half_day);
    setCalculatedDays(days);

    if (selectedBalance && days > selectedBalance.remaining) {
      setSoftWarning(`Notice: Requesting ${days} days exceeds your available balance of ${selectedBalance.remaining} days for ${selectedBalance.name}.`);
    } else {
      setSoftWarning(null);
    }
  }, [formData.start_date, formData.end_date, formData.is_half_day, formData.leave_type_id, selectedBalance]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const next = { ...prev, [name]: val };
      if (name === 'is_half_day' && checked && next.start_date) {
        next.end_date = next.start_date;
      }
      return next;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleReset = () => {
    setFormData({
      leave_type_id: '',
      start_date: '',
      end_date: '',
      reason: '',
      is_half_day: false
    });
    setErrors({});
    setSoftWarning(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToValidate = {
      ...formData,
      total_days: calculatedDays
    };

    const validation = validateApplyLeave(dataToValidate, selectedBalance ? selectedBalance.remaining : null);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      employee_id: String(user.id),
      leave_type_id: String(formData.leave_type_id),
      start_date: formData.start_date,
      end_date: formData.is_half_day ? formData.start_date : formData.end_date,
      total_days: calculatedDays,
      reason: formData.reason.trim()
    };

    const result = await applyLeave(payload);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/leave-history');
    }
  };

  return (
    <div className="apply-leave-container">
      <div className="apply-leave-layout">
        <div className="apply-leave-card">
          <div className="card-header-box">
            <h2 className="card-heading">Apply for Leave</h2>
            <p className="card-subheading">Submit your leave application for manager review and approval.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="leave-form-grid">
            <div className="form-field">
              <label className="field-label" htmlFor="leave-type-select">
                Leave Type <span className="required-star">*</span>
              </label>
              <select
                id="leave-type-select"
                name="leave_type_id"
                value={formData.leave_type_id}
                onChange={handleChange}
                className={`field-select ${errors.leave_type_id ? 'input-error' : ''}`}
              >
                <option value="">-- Select Leave Type --</option>
                {leaveTypes.map(lt => {
                  const b = balances.find(item => String(item.id) === String(lt.id));
                  return (
                    <option key={lt.id} value={lt.id}>
                      {lt.name} ({lt.code}) — Available: {b ? b.remaining : lt.annual_limit} days
                    </option>
                  );
                })}
              </select>
              {errors.leave_type_id && <span className="field-error-msg">{errors.leave_type_id}</span>}
            </div>

            <div className="form-row-two-col">
              <div className="form-field">
                <label className="field-label" htmlFor="start-date-input">
                  Start Date <span className="required-star">*</span>
                </label>
                <input
                  id="start-date-input"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`field-input ${errors.start_date ? 'input-error' : ''}`}
                />
                {errors.start_date && <span className="field-error-msg">{errors.start_date}</span>}
              </div>

              <div className="form-field">
                <label className="field-label" htmlFor="end-date-input">
                  End Date <span className="required-star">*</span>
                </label>
                <input
                  id="end-date-input"
                  type="date"
                  name="end_date"
                  value={formData.is_half_day ? formData.start_date : formData.end_date}
                  onChange={handleChange}
                  disabled={formData.is_half_day}
                  className={`field-input ${errors.end_date ? 'input-error' : ''}`}
                />
                {errors.end_date && <span className="field-error-msg">{errors.end_date}</span>}
              </div>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="is_half_day"
                checked={formData.is_half_day}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkbox-label">Half Day Leave (0.5 day)</span>
            </label>

            {calculatedDays > 0 && (
              <div className="days-summary-badge">
                <span>Calculated Duration:</span>
                <span className="days-count-highlight">
                  {calculatedDays} {calculatedDays === 1 || calculatedDays === 0.5 ? 'Day' : 'Days'}
                </span>
              </div>
            )}

            {softWarning && (
              <div className="warning-alert-box">
                <FiAlertCircle /> {softWarning}
              </div>
            )}

            <div className="form-field">
              <label className="field-label" htmlFor="reason-input">
                Reason for Leave <span className="required-star">*</span>
              </label>
              <textarea
                id="reason-input"
                name="reason"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please describe the reason for your leave request..."
                className={`field-textarea ${errors.reason ? 'input-error' : ''}`}
              />
              {errors.reason && <span className="field-error-msg">{errors.reason}</span>}
            </div>

            <div className="form-action-buttons">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                <FiSend /> {isSubmitting ? 'Submitting...' : 'Apply Leave'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <FiRotateCcw /> Reset
              </button>
            </div>
          </form>
        </div>

        <div className="balance-side-panel">
          <div className="policy-info-card">
            <h4 className="policy-title">Your Leave Balances</h4>
            <ul className="policy-list">
              {balances.map(b => (
                <li key={b.id} className="policy-item">
                  <span>
                    <LeaveTypeBadge code={b.code} name={b.name} /> {b.name}
                  </span>
                  <span className="policy-badge">{b.remaining} / {b.annual_limit} left</span>
                </li>
              ))}
            </ul>
            <div className="policy-note">
              Leave balance will be updated after approval of your leave request by a manager.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
