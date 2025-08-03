const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Student Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Student Management System</h2>
        <p>Thank you for registering with our Student Management System. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button above doesn't work, you can also copy and paste the following link in your browser:</p>
        <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - Student Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>
        <p>You have requested to reset your password for your Student Management System account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button above doesn't work, you can also copy and paste the following link in your browser:</p>
        <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This password reset link will expire in 10 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendAttendanceAlert = async (email, studentName, date, status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Attendance Alert - ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${status === 'absent' ? '#dc2626' : '#f59e0b'};">Attendance Alert</h2>
        <p>This is to inform you about ${studentName}'s attendance:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Status:</strong> <span style="color: ${status === 'absent' ? '#dc2626' : '#f59e0b'}; font-weight: bold;">${status.toUpperCase()}</span></p>
        </div>
        <p>If you have any questions, please contact the school administration.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendGradeNotification = async (email, studentName, subject, grade, examName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `New Grade Posted - ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">New Grade Posted</h2>
        <p>A new grade has been posted for ${studentName}:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Assessment:</strong> ${examName}</p>
          <p><strong>Grade:</strong> <span style="color: #16a34a; font-weight: bold;">${grade}</span></p>
        </div>
        <p>Login to the Student Management System to view detailed results.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAttendanceAlert,
  sendGradeNotification,
};