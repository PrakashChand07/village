import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { Eye, EyeOff, Mail, Lock, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

export default function UserLoginPage() {
  const { login, verifyOTP } = useUserAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.requiresOTP) {
        setShowOtpScreen(true);
        setSuccessMsg(res.message);
      } else {
        navigate('/'); // Redirect to Home
      }
    } catch (err: any) {
      if (err.response?.data?.requiresOTP) {
        setShowOtpScreen(true);
        setSuccessMsg(err.response?.data?.message);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp) return setError('Please enter OTP');
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      navigate('/'); // Redirect to Home
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a3c1a] via-[#2D7A1F] to-[#6DBE45] p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6DBE45] to-[#2D7A1F] rounded-2xl mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{showOtpScreen ? 'Verify Email' : 'Welcome Back!'}</h1>
            <p className="text-gray-500 mt-1">{showOtpScreen ? `OTP sent to ${email}` : 'Sign in to continue your exam preparation'}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5 text-sm">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5 text-sm">
              {successMsg}
            </div>
          )}

          {showOtpScreen ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter 6-Digit OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6DBE45] focus:ring-2 focus:ring-[#6DBE45]/20 transition-all text-center tracking-widest font-bold"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 mt-2">
                {loading ? 'Verifying...' : <>Verify & Login <ArrowRight className="w-4 h-4" /></>}
              </button>
              <button type="button" onClick={() => { setShowOtpScreen(false); setSuccessMsg(''); }} className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3 text-center">
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6DBE45] focus:ring-2 focus:ring-[#6DBE45]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6DBE45] focus:ring-2 focus:ring-[#6DBE45]/20 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 mt-2"
            >
              {loading ? 'Signing in...' : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/test-series/register" className="text-[#2D7A1F] font-semibold hover:underline">
              Create Account
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/test-series" className="text-sm text-gray-400 hover:text-gray-600">
              ← Browse Test Series without login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
