/**
 * Helper to inject Cloudinary real-time optimization parameters
 * (f_auto: automatic format/WebP/AVIF, q_auto: automatic quality compression).
 */
export const optimizeCloudinaryUrl = (url, width) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // If it already has transformation options, return it as-is
  if (
    url.includes('/image/upload/f_auto') || 
    url.includes('/image/upload/q_auto') || 
    url.includes('/image/upload/w_')
  ) {
    return url;
  }

  const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
  
  // Replace the first occurrence of '/image/upload/' with '/image/upload/<transform>/'
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
};
