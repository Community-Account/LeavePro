import React, { useState } from 'react';
import { FiSearch, FiUserPlus, FiX } from 'react-icons/fi';
import { useLeaves } from '../hooks/useLeaves';
import { validateEmployee } from '../utils/validation';
import profileImg from '../assets/profile.jpg';
import './Employees.css';

export const Employees = () => {
  const { users, departments, addEmployee } = useLeaves();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_id: '',
    role: 'employee',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => String(d.id) === String(deptId));
    return dept ? dept.name : 'General';
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesDept = selectedDepartment === 'All' || String(u.department_id) === String(selectedDepartment);
    return matchesSearch && matchesDept;
  });

  const handleOpenModal = () => {
    setFormData({
      name: '',
      email: '',
      department_id: departments[0]?.id ? String(departments[0].id) : '1',
      role: 'employee',
      status: 'Active'
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateEmployee(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    const result = await addEmployee({
      ...formData,
      password: 'password123'
    });
    setIsSubmitting(false);

    if (result.success) {
      handleCloseModal();
    }
  };

  return (
    <div className="employees-page-container">
      <div className="employees-header-bar">
        <div className="welcome-text-group">
          <h2 className="welcome-heading">Employees Directory</h2>
          <p className="welcome-subheading">View organizational staff, department allocations, and account statuses.</p>
        </div>
        <button type="button" className="btn-primary" onClick={handleOpenModal}>
          <FiUserPlus /> Add Employee
        </button>
      </div>

      <div className="employees-controls-card">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search employees by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label" htmlFor="dept-filter">Department:</label>
            <select
              id="dept-filter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="leave-table-card">
        <div className="table-responsive-wrapper">
          <table className="leave-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="employee-cell">
                      <img src={profileImg} alt={emp.name} className="employee-avatar-circle" />
                      <div className="employee-cell-meta">
                        <span className="employee-cell-name">{emp.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>{getDepartmentName(emp.department_id)}</td>
                  <td>{emp.email}</td>
                  <td>
                    <span className="employee-cell-role">{emp.role}</span>
                  </td>
                  <td>
                    <span className="employee-status-badge">{emp.status || 'Active'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Employee</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                <div className="form-field">
                  <label className="field-label" htmlFor="emp-name">Full Name *</label>
                  <input
                    id="emp-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={`field-input ${errors.name ? 'input-error' : ''}`}
                  />
                  {errors.name && <span className="field-error-msg">{errors.name}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label" htmlFor="emp-email">Email Address *</label>
                  <input
                    id="emp-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@company.com"
                    className={`field-input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <span className="field-error-msg">{errors.email}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label" htmlFor="emp-dept">Department *</label>
                  <select
                    id="emp-dept"
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className={`field-select ${errors.department_id ? 'input-error' : ''}`}
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.department_id && <span className="field-error-msg">{errors.department_id}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label" htmlFor="emp-role">System Role</label>
                  <select
                    id="emp-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
