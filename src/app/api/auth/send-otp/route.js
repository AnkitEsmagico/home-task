import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import User from '@/models/User';
import { generateOTP } from '@/lib/utils';

export async function POST(request) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
    
    const { phone } = await request.json();
    console.log('Received phone:', phone);

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    console.log('Generated OTP:', otp);

    let user = await User.findOne({ phone });
    if (!user) {
      console.log('Creating new user');
      user = new User({ phone, name: '', otp, otpExpiry });
    } else {
      console.log('Updating existing user');
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();
    console.log('User saved successfully');

    // Send OTP via Twilio if credentials are available
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        await client.messages.create({
          body: `Your Family Tasks OTP is: ${otp}. Valid for 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
        console.log('SMS sent successfully via Twilio');
      } catch (twilioError) {
        console.error('Twilio SMS error:', twilioError);
        // Continue without SMS in development
      }
    }

    // Always log OTP for development
    console.log(`OTP for ${phone}: ${otp}`);

    return NextResponse.json({ message: 'OTP sent successfully', otp: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}