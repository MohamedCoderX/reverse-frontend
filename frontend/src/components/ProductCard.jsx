import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { optimizeCloudinaryUrl } from '../utils/imageOptimizer';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.countInStock === 0;
  const isLowStock = !isOutOfStock && product.countInStock <= 10 && product.countInStock > 0;
  const isIndependenceOffer = product?.name?.toLowerCase().includes('combo');

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl flex flex-col h-full ${
        isIndependenceOffer ? 'border border-orange-200' : 'border border-gray-100'
      } ${isOutOfStock ? 'opacity-75' : ''}`}
    >
      {/* INDEPENDENCE DAY SPECIAL BANNER */}
      {isIndependenceOffer && (
        <div className="bg-gradient-to-r from-orange-400 via-white to-green-500 text-center py-2 border-b border-orange-100">
          <span className="text-[10px] md:text-xs font-black tracking-widest text-[#1e3a8a] uppercase">Independence Day Special</span>
        </div>
      )}
      <Link
        to={`/product/${product._id}`}
        className="relative block aspect-[5/4.5] overflow-hidden bg-[#fdfbf7]"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={optimizeCloudinaryUrl(product.image, 600)}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
            Out of Stock
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
            Only {product.countInStock} left
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-[#064e3b] mb-1 group-hover:text-[#c5a059] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xl font-black text-[#064e3b]">₹{product.price}</span>
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="text-xs bg-[#c5a059] text-white px-2 py-0.5 rounded-full font-bold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : isIndependenceOffer
                  ? 'bg-gradient-to-r from-orange-500 via-yellow-500 to-green-600 text-white hover:opacity-90'
                  : 'bg-[#064e3b] text-white hover:bg-[#c5a059]'
            }`}
          >
            <ShoppingCart size={18} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;