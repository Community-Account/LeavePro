export const validateApplyLeave = (formData, remainingBalance = null) => {
  const errors = {};
  if (!formData.leave_type_id) {
    errors.leave_type_id = 'Please select a leave type';
  }
  if (!formData.start_date) {
    errors.start_date = 'Start date is required';
  }
  if (!formData.end_date) {
    errors.end_date = 'End date is required';
  }
  if (formData.start_date && formData.end_date) {
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (end < start) {
      errors.end_date = 'End date cannot be before start date';
    }
  }
  if (!formData.reason || !formData.reason.trim()) {
    errors.reason = 'Reason is required';
  }
  let warning = null;
  if (remainingBalance !== null && formData.total_days > remainingBalance) {
    warning = `Requested days (${formData.total_days}) exceed your available balance (${remainingBalance}).`;
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warning
  };
};

export const validateLogin = (email, password) => {
  const errors = {};
  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }
  if (!password) {
    errors.password = 'Password is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEmployee = (formData) => {
  const errors = {};
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Employee name is required';
  }
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }
  if (!formData.department_id) {
    errors.department_id = 'Please select a department';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
