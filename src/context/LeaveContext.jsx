import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getLeaveRequests,
  getLeaveTypes,
  getDepartments,
  getUsers,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  createUser
} from '../services/api';
import { toast } from 'react-toastify';

export const LeaveContext = createContext(null);

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqs, types, depts, usrs] = await Promise.all([
        getLeaveRequests(),
        getLeaveTypes(),
        getDepartments(),
        getUsers()
      ]);
      setLeaveRequests(reqs);
      setLeaveTypes(types);
      setDepartments(depts);
      setUsers(usrs);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load leave data. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const applyLeave = async (newRequest) => {
    try {
      const created = await createLeaveRequest(newRequest);
      setLeaveRequests(prev => [created, ...prev]);
      toast.success('Leave application submitted successfully!');
      return { success: true, data: created };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave application');
      return { success: false, error: err };
    }
  };

  const approveRequest = async (id, managerName = 'Manager') => {
    try {
      const updated = await approveLeaveRequest(id, managerName);
      setLeaveRequests(prev => prev.map(r => String(r.id) === String(id) ? updated : r));
      toast.success('Leave request approved successfully!');
      return { success: true, data: updated };
    } catch (err) {
      toast.error('Failed to approve leave request');
      return { success: false, error: err };
    }
  };

  const rejectRequest = async (id, managerName = 'Manager') => {
    try {
      const updated = await rejectLeaveRequest(id, managerName);
      setLeaveRequests(prev => prev.map(r => String(r.id) === String(id) ? updated : r));
      toast.info('Leave request rejected');
      return { success: true, data: updated };
    } catch (err) {
      toast.error('Failed to reject leave request');
      return { success: false, error: err };
    }
  };

  const addEmployee = async (userData) => {
    try {
      const created = await createUser(userData);
      setUsers(prev => [...prev, created]);
      toast.success('Employee added successfully!');
      return { success: true, data: created };
    } catch (err) {
      toast.error('Failed to add employee');
      return { success: false, error: err };
    }
  };

  const value = {
    leaveRequests,
    leaveTypes,
    departments,
    users,
    loading,
    error,
    fetchAllData,
    applyLeave,
    approveRequest,
    rejectRequest,
    addEmployee
  };

  return (
    <LeaveContext.Provider value={value}>
      {children}
    </LeaveContext.Provider>
  );
};
