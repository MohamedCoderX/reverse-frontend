import React, { useState, useEffect } from 'react';

const OfferCountdown = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [offerStatus, setOfferStatus] = useState('upcoming'); // 'upcoming', 'active', 'ended'

  useEffect(() => {
    // August 15, 2026 IST
    const startTime = new Date('2026-08-15T00:00:00+05:30').getTime();
    const endTime = new Date('2026-08-15T23:59:59+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();

      if (now < startTime) {
        setOfferStatus('upcoming');
        calculateTimeLeft(startTime - now);
      } else if (now >= startTime && now <= endTime) {
        setOfferStatus('active');
        calculateTimeLeft(endTime - now);
      } else {
        setOfferStatus('ended');
      }
    };

    const calculateTimeLeft = (distance) => {
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(distance / (1000 * 60 * 60 * 24)) * 24;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (offerStatus === 'ended') return null;

  return (
    <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] text-[#000080] text-center py-2 px-4 text-sm md:text-base font-bold flex flex-wrap items-center justify-center gap-2 shadow-md drop-shadow-sm">
      {offerStatus === 'upcoming' && (
        <>
          <span>🇮🇳 Independence Day Offer starts in:</span>
          <span className="font-mono font-bold tracking-wider">{timeLeft}</span>
        </>
      )}
      {offerStatus === 'active' && (
        <>
          <span>🇮🇳 Independence Day Offer! Combo at ₹349 ends in:</span>
          <span className="font-mono font-bold tracking-wider">{timeLeft}</span>
        </>
      )}
    </div>
  );
};

export default OfferCountdown;
