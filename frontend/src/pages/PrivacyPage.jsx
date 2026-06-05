import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#064e3b] hover:text-[#c5a059] transition-colors mb-12">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-serif font-black text-[#064e3b] mb-12">Privacy Policy</h1>
        
        <div className="space-y-8 text-[#064e3b]/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">1. Information We Collect</h2>
            <p>We collect personal information that you provide directly to us, including name, email address, phone number, and shipping address when you place an order.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">2. How We Use Your Information</h2>
            <p>We use your information to process orders, communicate with you about your purchases, and provide customer support. We may also use your information to improve our services and website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">3. Information Sharing</h2>
            <p>We do not sell or share your personal information with third parties except as necessary to process payments (Razorpay) and fulfill your orders.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">5. Cookies</h2>
            <p>Our website uses cookies to enhance user experience. You can disable cookies through your browser settings, though this may affect website functionality.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">6. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. Contact us at reverserituals@gmail.com to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">7. Children's Privacy</h2>
            <p>Our website is not intended for children under 13. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#064e3b] mb-4">9. Contact Information</h2>
            <p>For questions about this privacy policy, please contact us at reverserituals@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
