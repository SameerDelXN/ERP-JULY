// app/api/send-verification-email/route.js
import nodemailer from 'nodemailer';

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  // Generate verification token
  const token = "2214234sdwfwgeADdwf231"
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Email Verification for Your Enquiry',
    html: `
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>Or copy and paste this link in your browser:</p>
      <p>${verificationLink}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return Response.json({ 
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ 
      error: 'Failed to send verification email',
      details: error.message 
    }, { status: 500 });
  }
}