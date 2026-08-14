// backend/utils/offerUtils.js

const isIndependenceDayOfferActive = () => {
  // Use Indian Standard Time (IST) offset +05:30
  // August 15, 2026 00:00:00 IST to August 15, 2026 23:59:59 IST
  const startTime = new Date('2026-08-15T00:00:00+05:30');
  const endTime = new Date('2026-08-15T23:59:59+05:30');
  const now = new Date();
  
  return now >= startTime && now <= endTime;
};

const applyOfferToProduct = (product) => {
  // Convert mongoose document to plain object if necessary
  const prod = product.toObject ? product.toObject() : { ...product };
  
  // Check if it's the combo product by ID or Name
  if (
    (prod.name && prod.name.includes('Reverse Ritual Combo')) || 
    (prod._id && prod._id.toString() === 'alchemy-combo')
  ) {
    if (isIndependenceDayOfferActive()) {
      prod.originalPrice = prod.price;
      prod.price = 349;
    }
  }
  return prod;
};

module.exports = {
  isIndependenceDayOfferActive,
  applyOfferToProduct
};
