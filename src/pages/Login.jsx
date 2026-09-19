import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { validateLogin } from '../utils/validation';
import logoImg from '../assets/logo.png';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLogin(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) {
      if (result.user.role === 'manager') {
        navigate('/leave-requests');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
  };

  return (
    <div className="login-page-container">
      <div className="login-left-banner">
        <div className="login-left-content">
          <div className="login-brand-logo">
            <div className="login-logo-box">
              <img src={logoImg} alt="Leave Life Logo" className="login-logo-img" />
            </div>
            <span className="login-brand-text">
              Leave<span className="login-brand-accent">Life</span>
            </span>
          </div>

          <h2 className="login-tagline-heading">
            Streamlined Employee Leave Management
          </h2>
          <p className="login-tagline-desc">
            Effortlessly request time off, track balances, approve applications, and manage your organization's leaves in one unified platform.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <span className="feature-check-icon"><FiCheckCircle /></span>
              <span>Real-time leave balance tracking (CL, SL, EL, PL)</span>
            </div>
            <div className="login-feature-item">
              <span className="feature-check-icon"><FiCheckCircle /></span>
              <span>Instant leave application and manager approvals</span>
            </div>
            <div className="login-feature-item">
              <span className="feature-check-icon"><FiCheckCircle /></span>
              <span>Comprehensive department & employee management</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right-card-section">
        <div className="login-card">
          <div className="login-card-header">
            <h3 className="login-card-title">Sign In</h3>
            <p className="login-card-subtitle">Enter your credentials to access your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email-input"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                />
              </div>
              {errors.email && <span className="field-error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">Password</label>
              <div className="input-wrapper">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="field-error-msg">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="demo-accounts-box">
            <h5 className="demo-title">Demo Accounts (Click to fill)</h5>
            <div
              className="demo-row"
              onClick={() => fillDemo('employee@company.com', '123456')}
            >
              <div className="demo-info">
                <span className="demo-role-tag">Employee</span>
                <span className="demo-email">employee@company.com / 123456</span>
              </div>
              <button type="button" className="demo-use-btn">Use</button>
            </div>
            <div
              className="demo-row"
              onClick={() => fillDemo('manager@company.com', '123456')}
            >
              <div className="demo-info">
                <span className="demo-role-tag">Manager</span>
                <span className="demo-email">manager@company.com / 123456</span>
              </div>
              <button type="button" className="demo-use-btn">Use</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
