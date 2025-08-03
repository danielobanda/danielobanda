const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { User, Student } = require('../models');
const emailService = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      phone,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists',
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'student',
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      phone,
      address,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
    });

    // If registering a student, create student profile
    if (user.role === 'student') {
      const studentId = `STU${new Date().getFullYear()}${String(
        Math.floor(Math.random() * 10000)
      ).padStart(4, '0')}`;
      
      await Student.create({
        userId: user.id,
        studentId,
        admissionNumber: `ADM${studentId}`,
        admissionDate: new Date(),
      });
    }

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user.email, user.emailVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ 
      where: { email },
      include: [
        {
          model: Student,
          as: 'studentProfile',
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated. Please contact administrator.' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        studentProfile: user.studentProfile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
      res.json({ message: 'Password reset email sent' });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Student,
          as: 'studentProfile',
          required: false,
        },
      ],
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
};