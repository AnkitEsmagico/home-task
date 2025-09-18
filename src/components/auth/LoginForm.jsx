'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiPhone, FiLock } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSendOtpMutation, useVerifyOtpMutation } from '@/store/api/apiSlice';
import { setCredentials } from '@/store/slices/authSlice';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const dispatch = useDispatch();

  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtp(phone).unwrap();
      setStep('otp');
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyOtp({ phone, otp }).unwrap();
      dispatch(setCredentials(result));
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Family Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={sendingOtp}>
                {sendingOtp ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={verifyingOtp}>
                {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep('phone')}
              >
                Back to Phone
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}