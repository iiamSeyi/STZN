// src/components/ImageViewerModal.jsx
import React, { useEffect, useState } from 'react';

const ImageViewerModal = ({ imageUrl, onClose }) => {
  const [scale, setScale] = useState(1);
  
//   const handleZoomIn = () => {
//     setScale(prev => Math.min(prev + 0.25, 3));
//   };

//   const handleZoomOut = () => {
//     setScale(prev => Math.max(prev - 0.25, 0.5));
//   };

// Zoom functions with console logs for debugging
  const handleZoomIn = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setScale(prevScale => {
      const newScale = Math.min(prevScale + 0.25, 3);
      console.log('Zooming in:', newScale);
      return newScale;
    });
  };

  const handleZoomOut = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setScale(prevScale => {
      const newScale = Math.max(prevScale - 0.25, 0.5);
      console.log('Zooming out:', newScale);
      return newScale;
    });
  };

  // Handle close with console log
  const handleClose = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('Closing modal');
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
        {/* <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            className="text-white bg-black bg-opacity-50 w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-75"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="text-white bg-black bg-opacity-50 w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-75"
          >
            -
          </button>
          <button
            onClick={onClose}
            className="text-white bg-black bg-opacity-50 w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-75"
          >
            ×
          </button> */}

          {/* Control buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button
            type="button"
            onClick={handleZoomIn}
            className="text-white bg-black bg-opacity-50 w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            <span className="text-2xl">+</span>
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="text-white bg-black bg-opacity-50 w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            <span className="text-2xl">-</span>
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="text-white bg-black bg-opacity-50 w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-75 focus:outline-none"
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
