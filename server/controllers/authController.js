import User from '../models/User.js';
import Otp from '../models/Otp.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' });
    }

    // Rate limiting: Check if OTP was sent in last 30 seconds
    const existingOtp = await Otp.findOne({ phone: cleanPhone });
    if (existingOtp && existingOtp.lastSentAt) {
      const timeDiff = (Date.now() - new Date(existingOtp.lastSentAt).getTime()) / 1000;
      if (timeDiff < 30) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(30 - timeDiff)} seconds before requesting a new OTP`
        });
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save or update OTP record
    await Otp.findOneAndUpdate(
      { phone: cleanPhone },
      {
        phone: cleanPhone,
        otp: otpCode,
        attempts: 0,
        lastSentAt: new Date(),
        expiresAt
      },
      { upsert: true, new: true }
    );

    // Call SmsHorizon API matching official documentation and API console
    const rawApiKey = process.env.SMSHORIZON_API_KEY;
    const apiKey = (rawApiKey && !rawApiKey.includes('YOUR_') && rawApiKey.trim().length > 5) 
      ? rawApiKey.trim() 
      : 'ldPBxWuf3A3Yao28lCfwjTivLgs1re';

    const rawUser = process.env.SMSHORIZON_USER;
    const user = (rawUser && !rawUser.includes('YOUR_') && rawUser.trim().length > 0)
      ? rawUser.trim()
      : 'mohitdecodes';

    const rawSenderId = process.env.SMSHORIZON_SENDER_ID;
    const senderId = (rawSenderId && !rawSenderId.includes('YOUR_') && rawSenderId.trim().length > 0)
      ? rawSenderId.trim()
      : '8235402646';

    const rawTemplateId = process.env.SMSHORIZON_TEMPLATE_ID;
    const templateId = (rawTemplateId && !rawTemplateId.includes('YOUR_') && rawTemplateId.trim().length > 0)
      ? rawTemplateId.trim()
      : '1607100000000323238';

    const smsMessage = `OTP for your new user account registration is: ${otpCode}\n\n- SmsHorizon`;

    // Safe debugging logs (only boolean flags)
    console.log('SmsHorizon Credentials Check:');
    console.log('API key configured:', Boolean(apiKey));
    console.log('Username configured:', Boolean(user));
    console.log('Sender ID configured:', Boolean(senderId));
    console.log('Template ID configured:', Boolean(templateId));

    if (apiKey) {
      try {
        const bodyParams = new URLSearchParams({
          user,
          apikey: apiKey,
          number: cleanPhone,
          senderid: senderId,
          message: smsMessage,
          type: 'txt',
          tid: templateId,
          prettyprint: '1'
        });

        const fetchRes = await fetch('https://smshorizon.co.in/api/v2/sendsms.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${apiKey}`
          },
          body: bodyParams.toString()
        });

        const smsResult = await fetchRes.json().catch(() => null) || await fetchRes.text();
        console.log('SmsHorizon response for phone:', cleanPhone, smsResult);
      } catch (smsErr) {
        console.error('SmsHorizon dispatch failed:', smsErr.message);
      }
    } else {
      console.warn('SMSHORIZON_API_KEY not configured in environment. Generated OTP for phone:', cleanPhone);
    }

    // NEVER return or log the actual OTP in API response
    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
    }

    const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);
    const cleanOtp = otp.toString().trim();

    const otpRecord = await Otp.findOne({ phone: cleanPhone });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not requested. Please click Resend OTP.' });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ success: false, message: 'Maximum OTP attempts exceeded. Please request a new OTP.' });
    }

    if (otpRecord.otp !== cleanOtp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = 5 - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
      });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      verified: true,
      phone: cleanPhone,
      message: 'OTP verified successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const signupSms = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Invalid 10-digit mobile number' });
    }

    let user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      const userName = name && name.trim().length >= 2 ? name.trim() : `Learner ${cleanPhone.slice(-4)}`;
      user = await User.create({
        name: userName,
        phone: cleanPhone,
        phoneVerified: true,
        authProvider: 'sms',
        avatar: `https://ui-avatars.com/api/?background=7c3aed&color=fff&name=${encodeURIComponent(userName)}&size=200`,
        role: 'user',
        lastActive: new Date()
      });
    } else {
      user.phoneVerified = true;
      user.authProvider = 'sms';
      user.lastActive = new Date();
      if (name && name.trim().length >= 2) {
        user.name = name.trim();
      }
      await user.save({ validateBeforeSave: false });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential/ID Token is required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId ? [clientId] : undefined,
      });
    } catch (verifyErr) {
      console.error('Google token verification failed:', verifyErr.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired Google token' });
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Google authentication failed: Email missing' });
    }

    const { sub: googleId, name, email, picture } = payload;

    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }]
    });

    if (user) {
      user.googleId = googleId;
      user.provider = 'google';
      if (picture) {
        user.profilePicture = picture;
        if (!user.avatar || user.avatar.includes('ui-avatars.com')) {
          user.avatar = picture;
        }
      }
      user.lastActive = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        provider: 'google',
        avatar: picture || `https://ui-avatars.com/api/?background=7c3aed&color=fff&name=${encodeURIComponent(name || 'User')}&size=200`,
        profilePicture: picture || '',
        role: 'user',
        lastActive: new Date()
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        sendTokenResponse(user, 201, res);
    } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        sendTokenResponse(user, 200, res);
    } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    res.status(200).json({ success: true, data: {} });
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('enrolledCourses savedBlogs');
        res.status(200).json({ success: true, data: { user } });
    } catch (err) { next(err); }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        res.status(200).json({ success: true, data: resetToken });
    } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ success: false, error: 'Invalid token' });
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        sendTokenResponse(user, 200, res);
    } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
        };

        if (req.body.avatar) {
            fieldsToUpdate.avatar = req.body.avatar;
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

export const socialLogin = async (req, res, next) => {
    try {
        const { name, email, avatar, provider } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Please provide email from provider' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random password for OAuth users
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                avatar: avatar || `https://ui-avatars.com/api/?background=7c3aed&color=fff&name=${encodeURIComponent(name || 'User')}&size=200`,
                password: randomPassword
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), httpOnly: true };
    
    // Create copy of user without password select
    const userObj = user.toObject();
    delete userObj.password;

    res.status(statusCode).cookie('token', token, options).json({ 
        success: true, 
        token,
        data: { user: userObj }
    });
};
