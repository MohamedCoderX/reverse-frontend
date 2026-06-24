const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');

console.log('=== EMAIL MODULE LOADED (RESILIENT API & NODEMAILER) ===');

// Initialize Brevo API if key is present
let transEmailApi = null;
if (process.env.BREVO_API_KEY) {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    console.log('✅ Brevo HTTP API Client initialized (Port 443 - Bypass SMTP blocks)');
  } catch (err) {
    console.log('⚠️ Failed to initialize Brevo HTTP API SDK:', err.message);
  }
} else {
  console.log('⚠️ BREVO_API_KEY not found in env. Operating in SMTP-only mode.');
}

// Custom lookup function to force IPv4
const customLookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { ...options, family: 4 }, callback);
};

// Helper to create transport with specified port and secure setting
const createSmtpTransporter = (port, secure) => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: port,
    secure: secure,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    lookup: customLookup, // Force IPv4 to prevent connection timeouts/errors due to IPv6 routing issues (ENETUNREACH)
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    connectionTimeout: 5000, // 5 seconds is plenty; if it hangs, it's blocked
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
};

// We default to port 465 (SMTPS / SSL) because it is rarely blocked by ISPs/firewalls,
// unlike port 587 which is heavily restricted by Indian ISPs (Jio, Airtel, etc.) and various cloud firewalls.
const defaultPort = parseInt(process.env.SMTP_PORT || '465', 10);
const defaultSecure = defaultPort === 465;

const primaryTransporter = createSmtpTransporter(defaultPort, defaultSecure);
const backupTransporter = createSmtpTransporter(defaultPort === 465 ? 587 : 465, defaultPort !== 465);

console.log(`✅ Resilient NodeMailer ready (Primary: Port ${defaultPort}, Backup: Port ${defaultPort === 465 ? 587 : 465})`);

// Resilient wrapper to send mail with automatic API-to-SMTP failover
const sendMailWithFailover = async (mailOptions) => {
  // 1. Try Brevo HTTP API first (Highly recommended for production, uses Port 443)
  if (transEmailApi) {
    try {
      console.log(`📧 Attempting HTTP API email dispatch via Brevo...`);
      
      // Parse recipients (handles comma separated lists like admin + customer)
      const toEmails = mailOptions.to.split(',').map(email => ({ email: email.trim() }));
      
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = mailOptions.subject;
      sendSmtpEmail.htmlContent = mailOptions.html;
      sendSmtpEmail.sender = { name: "Reverse Rituals", email: process.env.MAIL_USER || "reverserituals@gmail.com" };
      sendSmtpEmail.to = toEmails;

      if (mailOptions.attachments) {
        const fs = require('fs');
        sendSmtpEmail.attachment = mailOptions.attachments.map(att => {
          if (att.path && fs.existsSync(att.path)) {
            const fileBuffer = fs.readFileSync(att.path);
            return {
              content: fileBuffer.toString('base64'),
              name: att.filename
            };
          } else {
            return {
              url: att.path,
              name: att.filename
            };
          }
        });
      }

      const result = await transEmailApi.sendTransacEmail(sendSmtpEmail);
      console.log(`✅ HTTP API email dispatch succeeded! Message ID:`, result.messageId || (result.messageIds && result.messageIds[0]));
      return result;
    } catch (apiError) {
      console.log(`⚠️ Brevo HTTP API dispatch failed:`, apiError.message);
      console.log(`🔄 Falling back to SMTP relays...`);
    }
  }

  // 2. Fallback to Primary SMTP (Port 465)
  try {
    console.log(`📧 Attempting email dispatch via port ${defaultPort}...`);
    return await primaryTransporter.sendMail(mailOptions);
  } catch (primaryError) {
    console.log(`⚠️ Primary SMTP dispatch failed (Port ${defaultPort}):`, primaryError.message);
    const backupPort = defaultPort === 465 ? 587 : 465;
    
    // 3. Fallback to Backup SMTP (Port 587)
    console.log(`🔄 Initiating automatic failover dispatch via port ${backupPort}...`);
    try {
      const result = await backupTransporter.sendMail(mailOptions);
      console.log(`✅ Failover email dispatch succeeded on port ${backupPort}!`);
      return result;
    } catch (backupError) {
      console.log(`❌ Failover SMTP dispatch failed (Port ${backupPort}):`, backupError.message);
      throw backupError;
    }
  }
};

const sendOrderEmail = async (orderDetails) => {
  try {
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'reverserituals@gmail.com';
    console.log('📧 Sending order confirmation for:', orderDetails.orderId);
    
    const { orderId, customerName, address, items, total, email, phone, altPhone, estimatedDelivery, voiceReviewUrl } = orderDetails;

    let voiceReviewHtml = '';
    if (voiceReviewUrl) {
      voiceReviewHtml = `
        <!-- Voice Review -->
        <tr>
          <td style="padding:0 25px 15px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border-radius:4px;border:1px solid #bfdbfe;">
              <tr>
                <td style="padding:15px;">
                  <p style="margin:0;font-size:14px;font-weight:bold;color:#1e40af;">🎙️ Inbuilt Voice Review Received (+1 Free Packet)</p>
                  <p style="margin:5px 0 0;font-size:14px;">
                    <a href="${voiceReviewUrl}" target="_blank" style="color:#1d4ed8;font-weight:bold;text-decoration:underline;">Click here to listen or download the audio message</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    }

    let deliveryDateStr;
    if (estimatedDelivery) {
      deliveryDateStr = new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    } else {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    // Build order items HTML inline
    const orderItemsHtml = items.map(item => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50" valign="top">
                <img src="${item.image || 'https://via.placeholder.com/50x50?text=Product'}" alt="${item.name}" width="50" height="50" style="display:block;border-radius:4px;">
              </td>
              <td valign="top" style="padding-left:10px;font-size:14px;color:#333;">
                ${item.name}<br>
                <span style="color:#666;font-size:12px;">Qty: ${item.qty}</span>
              </td>
              <td align="right" valign="top" style="font-size:14px;color:#333;font-weight:500;">
                ₹${item.price}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');

    // HTML template builder
    const getHtmlTemplate = (voiceHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px;">
    <tr>
      <td align="center">
        <table width="550" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:20px 25px;background-color:#064e3b;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#ffffff;font-size:20px;font-weight:bold;">Reverse Rituals</td>
                  <td align="right" style="color:#c5a059;font-size:14px;">Order #${orderId}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Message -->
          <tr>
            <td style="padding:25px 25px 15px;">
              <h2 style="margin:0 0 10px;font-size:18px;color:#333;">Order Confirmed!</h2>
              <p style="margin:0;color:#666;font-size:14px;line-height:1.5;">
                Hi ${customerName}, thank you for your order! We're preparing it with care.
              </p>
            </td>
          </tr>
          <!-- Order Items -->
          <tr>
            <td style="padding:0 25px;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:bold;color:#333;">Order Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:4px;">
                ${orderItemsHtml}
              </table>
            </td>
          </tr>
          <!-- Total -->
          <tr>
            <td style="padding:15px 25px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:14px;color:#666;">Subtotal</td>
                  <td align="right" style="font-size:14px;color:#333;">₹${total}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#666;">Shipping</td>
                  <td align="right" style="font-size:14px;color:#666;">Free</td>
                </tr>
                <tr>
                  <td style="border-top:2px solid #064e3b;padding-top:10px;font-size:16px;font-weight:bold;color:#333;">Total</td>
                  <td align="right" style="border-top:2px solid #064e3b;padding-top:10px;font-size:16px;font-weight:bold;color:#064e3b;">₹${total}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Delivery -->
          <tr>
            <td style="padding:0 25px 15px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-radius:4px;border:1px solid #bbf7d0;">
                <tr>
                  <td style="padding:15px;">
                    <p style="margin:0;font-size:14px;font-weight:bold;color:#166534;">Estimated Delivery</p>
                    <p style="margin:5px 0 0;font-size:16px;color:#15803d;">${deliveryDateStr}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${voiceHtml}
          <!-- Address & Phone -->
          <tr>
            <td style="padding:0 25px 20px;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#333;">Shipping Address</p>
              <p style="margin:0;color:#666;font-size:14px;line-height:1.5;">
                ${customerName}<br>
                ${address}
              </p>
              <p style="margin:10px 0 0;font-size:14px;color:#333;">
                <strong>Phone:</strong> ${phone}${altPhone ? '<br><strong>Alt Phone:</strong> ' + altPhone : ''}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 25px;background-color:#f5f5f5;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#666;">
                Need help? Contact us at support@reverserituals.com
              </p>
              <p style="margin:0;font-size:11px;color:#999;">
                © ${new Date().getFullYear()} Reverse Rituals. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const adminHtml = getHtmlTemplate(voiceReviewHtml);
    const customerHtml = getHtmlTemplate('');

    let adminEmailSent = false;

    // 1. Compulsorily send to Admin Email
    const adminMailOptions = {
      from: `"Reverse Rituals" <${process.env.MAIL_USER}>`,
      to: adminEmail,
      subject: `Order Confirmed - #${orderId}`,
      html: adminHtml
    };

    if (voiceReviewUrl) {
      let attachmentPath = voiceReviewUrl;
      if (voiceReviewUrl.includes('/uploads/')) {
        const fileName = voiceReviewUrl.substring(voiceReviewUrl.lastIndexOf('/') + 1);
        const localPath = path.join(__dirname, '..', 'uploads', fileName);
        const fs = require('fs');
        if (fs.existsSync(localPath)) {
          attachmentPath = localPath;
        }
      }
      adminMailOptions.attachments = [
        {
          filename: 'voice-review.webm',
          path: attachmentPath
        }
      ];
    }

    try {
      console.log(`📧 Attempting compulsory admin notification to ${adminEmail}...`);
      const adminResult = await sendMailWithFailover(adminMailOptions);
      console.log('✅ Admin order email sent successfully!', adminResult?.messageId);
      adminEmailSent = true;
    } catch (adminError) {
      console.log('❌ Compulsory admin order email dispatch failed:', adminError.message);
    }

    // 2. Best-effort send to Customer Email
    const isEmailValid = email && typeof email === 'string' && email.trim() !== '' && email.includes('@') && email.includes('.');
    if (isEmailValid) {
      const customerMailOptions = {
        from: `"Reverse Rituals" <${process.env.MAIL_USER}>`,
        to: email.trim(),
        subject: `Order Confirmed - #${orderId}`,
        html: customerHtml
      };

      try {
        console.log(`📧 Attempting customer notification to ${email.trim()}...`);
        const customerResult = await sendMailWithFailover(customerMailOptions);
        console.log('✅ Customer order email sent successfully!', customerResult?.messageId);
      } catch (customerError) {
        console.log('❌ Customer order email dispatch failed (best effort):', customerError.message);
      }
    } else {
      console.log(`ℹ️ Customer email "${email}" is empty or invalid. Skipping customer dispatch.`);
    }

    // Return true if the critical/compulsory admin email was successfully sent
    return adminEmailSent;
  } catch (error) {
    console.log('❌ Order email execution error:', error.message);
    return false;
  }
};

const sendPasswordResetEmail = async (toEmail, name, otp) => {
  try {
    console.log('📧 Sending password reset to:', toEmail);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px;">
    <tr>
      <td align="center">
        <table width="450" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;">
          <tr>
            <td style="padding:30px 25px 20px;text-align:center;background-color:#064e3b;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">Reverse Rituals</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 25px 20px;text-align:center;">
              <div style="width:60px;height:60px;background-color:#fef3c7;border-radius:50%;margin:0 auto 20px;">
                <span style="font-size:30px;line-height:60px;">🔐</span>
              </div>
              <h2 style="margin:0 0 15px;font-size:20px;color:#333;">Reset Your Password</h2>
              <p style="margin:0;color:#666;font-size:14px;line-height:1.5;">
                Hi ${name}, we received a request to reset your password.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 25px 20px;text-align:center;">
              <div style="display:inline-block;background-color:#f5f5f5;padding:15px 30px;border-radius:8px;">
                <span style="font-size:28px;font-weight:bold;letter-spacing:8px;color:#333;">${otp}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 25px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef3c7;border-radius:4px;">
                <tr>
                  <td style="padding:15px;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#92400e;">
                      <strong>This code expires in 10 minutes.</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 25px 30px;text-align:center;">
              <p style="margin:0;color:#999;font-size:12px;">
                If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const mailOptions = {
      from: `"Reverse Rituals" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: 'Reset Your Password - OTP',
      html: html
    };

    const result = await sendMailWithFailover(mailOptions);
    console.log('✅ Password reset email sent!', result.messageId);
    return true;
  } catch (error) {
    console.log('❌ Password reset email error:', error.message);
    return false;
  }
};

const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Reverse Rituals" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent
    };

    const result = await sendMailWithFailover(mailOptions);
    console.log('✅ Email sent to:', toEmail);
    return true;
  } catch (error) {
    console.log('❌ Email error:', error.message);
    return false;
  }
};

module.exports = { sendOrderEmail, sendEmail, sendPasswordResetEmail };
