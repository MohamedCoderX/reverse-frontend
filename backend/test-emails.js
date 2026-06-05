require('dotenv').config();
const { sendOrderEmail, sendPasswordResetEmail, sendEmail } = require('./config/email');

console.log('\n=== TESTING EMAIL FUNCTIONALITY ===\n');

// Test 1: Send simple test email
async function testSimpleEmail() {
  console.log('\n--- Test 1: Simple Email ---');
  try {
    const result = await sendEmail(
      process.env.ADMIN_NOTIFY_EMAIL || 'reverserituals@gmail.com',
      'Test Email - Simple',
      '<h1>Test Email</h1><p>This is a simple test email to verify the email service is working.</p>'
    );
    console.log('Result:', result);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

// Test 2: Send password reset email
async function testPasswordReset() {
  console.log('\n--- Test 2: Password Reset Email ---');
  try {
    const result = await sendPasswordResetEmail(
      process.env.ADMIN_NOTIFY_EMAIL || 'reverserituals@gmail.com',
      'Test User',
      '123456'
    );
    console.log('Result:', result);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

// Test 3: Send order confirmation email
async function testOrderEmail() {
  console.log('\n--- Test 3: Order Confirmation Email ---');
  try {
    const orderDetails = {
      orderId: 'TEST001',
      customerName: 'John Doe',
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      total: 2999,
      items: [
        { name: 'Anti-Aging Serum', qty: 1, price: 1499, image: 'https://via.placeholder.com/60x60?text=Serum' },
        { name: 'Vitamin C Cream', qty: 2, price: 750, image: 'https://via.placeholder.com/60x60?text=Cream' }
      ]
    };
    
    const result = await sendOrderEmail(orderDetails);
    console.log('Result:', result);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  await testSimpleEmail();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testPasswordReset();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testOrderEmail();
  
  console.log('\n=== ALL TESTS COMPLETED ===\n');
}

runTests();
