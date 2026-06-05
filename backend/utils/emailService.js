const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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

function loadTemplate(templateName, data) {
  const templatePath = path.join(__dirname, '..', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf8');

  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value);
  }

  if (data.items) {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="60" valign="top">
                <img src="${item.image}" alt="${item.name}" width="60" height="60" style="display:block;border-radius:6px;object-fit:cover;">
              </td>
              <td valign="top" style="padding-left:16px;">
                <p style="margin:0;font-size:15px;font-weight:500;color:#111827;">${item.name}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Qty: ${item.quantity} ${item.variant ? '| ' + item.variant : ''}</p>
              </td>
              <td align="right" valign="top" style="color:#111827;font-size:15px;font-weight:500;">
                $${item.price}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');
    html = html.replace(/{{#each order_items}}[\s\S]*{{\/each}}/, itemsHtml);
  }

  return html;
}

async function sendOrderConfirmation(order) {
  const html = loadTemplate('order-confirmation', {
    logo_url: process.env.BRAND_LOGO || 'https://via.placeholder.com/140x40?text=LOGO',
    brand_name: process.env.BRAND_NAME || 'YourBrand',
    order_number: order.orderNumber,
    customer_name: order.customerName,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount || '',
    total: order.total,
    delivery_date: order.deliveryDate,
    shipping_name: order.shippingName,
    shipping_address: order.shippingAddress,
    shipping_city: order.shippingCity,
    shipping_state: order.shippingState,
    shipping_zip: order.shippingZip,
    track_order_url: order.trackOrderUrl,
    support_url: process.env.SUPPORT_URL || 'mailto:support@yourbrand.com',
    year: new Date().getFullYear()
  });

  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: order.customerEmail,
    subject: `Order Confirmed - #${order.orderNumber}`,
    html
  });
}

async function sendPasswordReset(email, name, resetUrl) {
  const html = loadTemplate('forgot-password', {
    logo_url: process.env.BRAND_LOGO || 'https://via.placeholder.com/120x40?text=LOGO',
    brand_name: process.env.BRAND_NAME || 'YourBrand',
    customer_name: name,
    reset_password_url: resetUrl,
    ip_address: '192.168.1.1',
    request_time: new Date().toLocaleString(),
    support_url: process.env.SUPPORT_URL || 'mailto:support@yourbrand.com',
    year: new Date().getFullYear()
  });

  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html
  });
}

module.exports = {
  sendOrderConfirmation,
  sendPasswordReset
};
