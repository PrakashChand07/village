import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

export default function UserRegisterPage() {
  const { register, verifyOTP } = useUserAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match!'); return; }
    if (form.phone.length < 10) { setError('Please enter a valid 10-digit phone number.'); return; }
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      if (res?.requiresOTP) {
        setShowOtpScreen(true);
      } else {
        navigate('/'); // Go back to Home if login was direct
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      await verifyOTP(form.email, otp);
      navigate('/'); // redirect to Home after verification
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a3c1a] via-[#2D7A1F] to-[#6DBE45] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6DBE45] to-[#2D7A1F] rounded-2xl mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{showOtpScreen ? 'Verify Email' : 'Create Account'}</h1>
            <p className="text-gray-500 mt-1">{showOtpScreen ? `OTP sent to ${form.email}` : 'Start your exam preparation journey'}</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>}

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
              <button type="button" onClick={() => setShowOtpScreen(false)} className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3 text-center">
                Back to Register
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Rahul Kumar', icon: User },
              { label: 'Email Address', field: 'email', type: 'email', placeholder: 'rahul@example.com', icon: Mail },
              { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '9876543210', icon: Phone, required: true },
            ].map(({ label, field, type, placeholder, icon: Icon }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label} {field === 'phone' && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={e => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6DBE45] focus:ring-2 focus:ring-[#6DBE45]/20 transition-all"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => handleChange('password', e.target.value)} placeholder="Min 6 characters" required
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6DBE45] focus:ring-2 focus:ring-[#6DBE45]/20 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)} placeholder="••••••••" required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6DBE45] focus:ring-2 focus:ring-[#6DBE45]/20 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 mt-2">
              {loading ? 'Sending OTP...' : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/test-series/login" className="text-[#2D7A1F] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
