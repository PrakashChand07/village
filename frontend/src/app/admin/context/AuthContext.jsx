import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, getMe } from '../../../services/admin-api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      getMe()
        .then((res) => setAdmin(res.data.admin))
        .catch(() => {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginAdmin({ email, password });
    localStorage.setItem('admin_token', res.data.token);
    localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
