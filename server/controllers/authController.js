import User from '../models/User.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

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
