'use client';

import panzoom from 'panzoom';
import { useEffect, useRef, useState } from 'react';

interface ZoomableIframeProps {
  src: string;
}

const ZoomableIframe: React.FC<ZoomableIframeProps> = ({ src }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const panZoomInstance = panzoom(containerRef.current, {
        maxZoom: 3,
        minZoom: 1,
      });

      return () => {
        panZoomInstance.dispose();
      };
    }
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`iframe-container relative ${
        isFullscreen ? 'h-screen w-screen' : 'h-96 w-full'
      } overflow-hidden border`}
    >
      {/* Zoom Button */}
      <button
        onClick={toggleFullscreen}
        className="hover:bg-white-900 absolute right-4 top-2 z-50 rounded bg-gray-700 p-2 text-2xl text-white"
        title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
      >
        {isFullscreen ? '⤢' : '⤡'} {/* Toggle button icon */}
      </button>

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={src}
        className="h-full w-full"
        title="Document Preview"
      />
    </div>
  );
};

export default ZoomableIframe;
