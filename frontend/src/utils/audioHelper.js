/**
 * Helper utilities for processing audio URLs for playback and download.
 */

/**
 * Transforms an audio URL into a highly-compatible playback URL.
 * Specifically converts Cloudinary URLs to use HTTPS and deliver the audio in MP3 format
 * so that it plays natively on macOS Safari, iOS, and other browsers that lack WebM/OGG support.
 * 
 * @param {string} url - The raw audio URL (local path or Cloudinary URL).
 * @returns {string} The optimized play URL.
 */
export const getAudioPlayUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let fullUrl = url.trim();
  
  // Resolve local uploads relative to VITE_API_URL
  if (fullUrl.startsWith('/uploads/')) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    fullUrl = `${API_URL.replace(/\/$/, '')}${fullUrl}`;
  }
  
  // Apply Cloudinary-specific optimizations
  if (fullUrl.includes('res.cloudinary.com')) {
    // Force HTTPS for secure playback
    fullUrl = fullUrl.replace('http://', 'https://');
    
    // Do NOT convert extension or append .mp3 for raw resources (Cloudinary does not support transcode for raw)
    if (fullUrl.includes('/raw/')) {
      return fullUrl;
    }
    
    // Convert extension to .mp3 on-the-fly for universal browser support (e.g. macOS Safari / iOS)
    const parts = fullUrl.split('/');
    const lastPart = parts[parts.length - 1];
    
    if (lastPart.includes('.')) {
      const dotIndex = lastPart.lastIndexOf('.');
      const nameWithoutExt = lastPart.substring(0, dotIndex);
      parts[parts.length - 1] = `${nameWithoutExt}.mp3`;
      fullUrl = parts.join('/');
    } else {
      fullUrl = `${fullUrl}.mp3`;
    }
  } else if (fullUrl.startsWith('http://') && window.location.protocol === 'https:') {
    // If admin/app is loaded over HTTPS, upgrade HTTP URLs (unless localhost)
    if (!fullUrl.includes('localhost') && !fullUrl.includes('127.0.0.1')) {
      fullUrl = fullUrl.replace('http://', 'https://');
    }
  }
  
  return fullUrl;
};

/**
 * Transforms an audio URL into a download URL.
 * For Cloudinary URLs, it inserts the 'fl_attachment' transformation. This forces Cloudinary 
 * to return the audio with 'Content-Disposition: attachment', causing the browser to download 
 * the file directly, bypassing JavaScript CORS errors entirely.
 * 
 * @param {string} url - The raw audio URL.
 * @param {string} [fallbackFilename] - The optional custom name for the downloaded file.
 * @returns {string} The download-ready URL.
 */
export const getAudioDownloadUrl = (url, fallbackFilename) => {
  if (!url || typeof url !== 'string') return '';
  let playUrl = getAudioPlayUrl(url);
  
  if (playUrl.includes('res.cloudinary.com')) {
    let downloadUrl = playUrl;
    if (downloadUrl.includes('/upload/')) {
      let attachmentParam = 'fl_attachment';
      if (fallbackFilename) {
        // Clean filename for Cloudinary attachment (only alphanumeric, hyphens, and underscores allowed)
        // Note: filename must not include extension, as Cloudinary adds the format extension automatically.
        const cleanName = fallbackFilename
          .replace(/\.[^/.]+$/, '') // remove any extension
          .replace(/[^a-zA-Z0-9-_]/g, '_'); // clean characters
        attachmentParam = `fl_attachment:${cleanName}`;
      }
      downloadUrl = downloadUrl.replace('/upload/', `/upload/${attachmentParam}/`);
    }
    return downloadUrl;
  }
  
  return playUrl;
};
