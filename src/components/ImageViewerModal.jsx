// src/components/ImageViewerModal.jsx
import React, { useEffect, useState } from 'react';

const ImageViewerModal = ({ imageUrl, onClose }) => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale((prevScale) => Math.min(prevScale + 0.25, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Control Buttons with consistent purple themed UI */}
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button
            type="button"
            onClick={handleZoomIn}
            className="text-white bg-gradient-to-r from-purple-500 to-purple-700 w-10 h-10 flex items-center justify-center rounded-full hover:from-purple-600 hover:to-purple-800 focus:outline-none transition-colors"
          >
            <span className="text-2xl">+</span>
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="text-white bg-gradient-to-r from-purple-500 to-purple-700 w-10 h-10 flex items-center justify-center rounded-full hover:from-purple-600 hover:to-purple-800 focus:outline-none transition-colors"
          >
            <span className="text-2xl">-</span>
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="text-white bg-gradient-to-r from-purple-500 to-purple-700 w-10 h-10 flex items-center justify-center rounded-full hover:from-purple-600 hover:to-purple-800 focus:outline-none transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        <div className="overflow-auto">
          <img
            src={imageUrl}
            alt="Flow"
            className="w-full h-auto max-h-[90vh] object-contain transition-transform duration-200"
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'center center'
            }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;
