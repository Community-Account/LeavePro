import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('leavepro_user');
    const storedToken = localStorage.getItem('leavepro_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem('leavepro_user');
        localStorage.removeItem('leavepro_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('leavepro_user', JSON.stringify(data.user));
      localStorage.setItem('leavepro_token', data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('leavepro_user');
    localStorage.removeItem('leavepro_token');
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
