export const calculateTotalDays = (startDate, endDate, isHalfDay = false) => {
  if (isHalfDay) {
    return 0.5;
  }
  if (!startDate || !endDate) {
    return 0;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  if (diffTime < 0) {
    return 0;
  }
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
  return diffDays + 1;
};

export const calculateLeaveBalances = (leaveTypes = [], leaveRequests = [], employeeId = null) => {
  const filteredRequests = employeeId
    ? leaveRequests.filter(r => String(r.employee_id) === String(employeeId))
    : leaveRequests;
  const approvedRequests = filteredRequests.filter(r => r.status === 'Approved');
  return leaveTypes.map(lt => {
    const used = approvedRequests
      .filter(r => String(r.leave_type_id) === String(lt.id))
      .reduce((sum, r) => sum + Number(r.total_days || 0), 0);
    const limit = Number(lt.annual_limit || 0);
    return {
      id: lt.id,
      name: lt.name,
      code: lt.code,
      annual_limit: limit,
      used,
      remaining: Math.max(0, limit - used)
    };
  });
};

export const calculateDashboardStats = (leaveTypes = [], leaveRequests = [], employeeId = null) => {
  const filteredRequests = employeeId
    ? leaveRequests.filter(r => String(r.employee_id) === String(employeeId))
    : leaveRequests;
  const totalLeaves = leaveTypes.reduce((sum, lt) => sum + Number(lt.annual_limit || 0), 0);
  const usedLeaves = filteredRequests
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + Number(r.total_days || 0), 0);
  const pendingRequests = filteredRequests.filter(r => r.status === 'Pending').length;
  const approvedRequests = filteredRequests.filter(r => r.status === 'Approved').length;
  const rejectedRequests = filteredRequests.filter(r => r.status === 'Rejected').length;
  return {
    totalLeaves,
    usedLeaves,
    remainingLeaves: Math.max(0, totalLeaves - usedLeaves),
    pendingRequests,
    approvedRequests,
    rejectedRequests
  };
};

export const getLeaveTypeColor = (code) => {
  switch (code) {
    case 'CL':
      return '#2F6FED';
    case 'SL':
      return '#10B981';
    case 'EL':
      return '#8B5CF6';
    case 'PL':
      return '#F59E0B';
    default:
      return '#64748B';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return { bg: '#DEF7EC', text: '#03543F', border: '#BCF0DA' };
    case 'Rejected':
      return { bg: '#FDE8E8', text: '#9B1C1C', border: '#F8B4B4' };
    case 'Pending':
    default:
      return { bg: '#FEF08A', text: '#854D0E', border: '#FDE047' };
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(month, 10) - 1] || month;
    return `${day} ${monthName} ${year}`;
  }
  return dateString;
};
