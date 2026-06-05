import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      await axios.post(`${API_URL}/api/users/reset-password`, { email, otp, newPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-[#064e3b]/50 hover:text-[#064e3b] mb-8 font-medium">
          <ArrowLeft size={18} /> Back to Login
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-[#064e3b]/5 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c5a059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-[#c5a059]" />
            </div>
            <h1 className="text-2xl font-bold text-[#064e3b]">
              {step === 1 ? 'Forgot Password?' : 'Reset Password'}
            </h1>
            <p className="text-[#064e3b]/50 mt-2 text-sm">
              {step === 1 
                ? 'Enter your email to receive OTP' 
                : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#064e3b]/60 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064e3b]/30" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-12 pr-4 py-4 bg-[#fdfbf7] border border-[#064e3b]/10 rounded-2xl focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#064e3b] text-white rounded-2xl font-bold hover:bg-[#c5a059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                <ArrowRight size={20} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#064e3b]/60 mb-2">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-4 bg-[#fdfbf7] border border-[#064e3b]/10 rounded-2xl focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#064e3b]/60 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-4 bg-[#fdfbf7] border border-[#064e3b]/10 rounded-2xl focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#064e3b]/60 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-4 bg-[#fdfbf7] border border-[#064e3b]/10 rounded-2xl focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#064e3b] text-white rounded-2xl font-bold hover:bg-[#c5a059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-3 py-3 text-[#064e3b]/50 text-sm hover:text-[#064e3b]"
              >
                Didn't receive OTP? Request again
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;