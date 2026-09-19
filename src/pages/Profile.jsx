import React from 'react';
import { FiUser, FiMail, FiShield, FiBriefcase, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useLeaves } from '../hooks/useLeaves';
import { formatDate } from '../utils/leaveUtils';
import profileImg from '../assets/profile.jpg';
import './Profile.css';

export const Profile = () => {
  const { user } = useAuth();
  const { departments } = useLeaves();

  const department = departments.find(d => String(d.id) === String(user?.department_id));

  return (
    <div className="profile-page-container">
      <div className="profile-card-top">
        <img src={profileImg} alt={user?.name || 'User'} className="profile-avatar-large" />
        <div className="profile-header-info">
          <h2 className="profile-name">{user?.name}</h2>
          <span className="profile-role-badge">
            <FiShield /> {user?.role}
          </span>
        </div>
      </div>

      <div className="profile-grid-sections">
        <div className="profile-details-card">
          <h3 className="profile-section-title">Personal & Professional Information</h3>
          <div className="profile-fields-grid">
            <div className="profile-field-box">
              <span className="profile-field-label">Full Name</span>
              <span className="profile-field-val">{user?.name}</span>
            </div>

            <div className="profile-field-box">
              <span className="profile-field-label">Email Address</span>
              <span className="profile-field-val">{user?.email}</span>
            </div>

            <div className="profile-field-box">
              <span className="profile-field-label">Role</span>
              <span className="profile-field-val">{user?.role}</span>
            </div>

            <div className="profile-field-box">
              <span className="profile-field-label">Department</span>
              <span className="profile-field-val">{department?.name || 'Development'}</span>
            </div>

            <div className="profile-field-box">
              <span className="profile-field-label">Account Status</span>
              <span className="profile-field-val">{user?.status || 'Active'}</span>
            </div>

            <div className="profile-field-box">
              <span className="profile-field-label">Member Since</span>
              <span className="profile-field-val">{formatDate(user?.created_at || '2024-01-15')}</span>
            </div>
          </div>
        </div>

        <div className="profile-details-card">
          <h3 className="profile-section-title">Account Security</h3>
          <div className="security-info-box">
            <span className="security-title">Password Protected</span>
            <p className="security-desc">
              Your account is secured with password authentication. Contact your company administrator to request password changes or permissions elevation.
            </p>
          </div>

          <div className="security-info-box">
            <span className="security-title">Session State</span>
            <p className="security-desc">
              Logged in as <strong>{user?.email}</strong>. Session details are cached in your local browser storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
