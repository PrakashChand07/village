import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAuthAPI } from '../api/testSeriesApi';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface UserAuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const storedToken = localStorage.getItem('user_token');
    const storedUser = localStorage.getItem('user_data');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await userAuthAPI.login({ email, password });
    if (res.data.requiresOTP) return res.data;
    
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('user_token', t);
    localStorage.setItem('user_data', JSON.stringify(u));
    return res.data;
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    const res = await userAuthAPI.register(data);
    return res.data; // Now returns requiresOTP: true instead of logging in
  };

  const verifyOTP = async (email: string, otp: string) => {
    const res = await userAuthAPI.verifyOTP({ email, otp });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('user_token', t);
    localStorage.setItem('user_data', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
  };

  return (
    <UserAuthContext.Provider value={{ user, token, isLoading, login, register, verifyOTP, logout, isAuthenticated: !!user }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used inside UserAuthProvider');
  return ctx;
}
