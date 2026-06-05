require('dotenv').config();
const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const isSecure = smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: isSecure,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

transporter.sendMail({
  from: process.env.MAIL_USER,
  to: process.env.ADMIN_NOTIFY_EMAIL,
  subject: 'Test - Backend Config',
  html: '<h1>Testing with reverserituals@gmail.com</h1><p>If you receive this, email is working!</p>'
}, (error, info) => {
  if (error) {
    console.log('FAILED:', error.message);
  } else {
    console.log('SUCCESS! Email sent to:', process.env.ADMIN_NOTIFY_EMAIL);
  }
});