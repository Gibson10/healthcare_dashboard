'use client';

import panzoom from 'panzoom';
import { useEffect, useRef } from 'react';

interface ZoomableIframeProps {
  src: string;
}

const ZoomableIframe: React.FC<ZoomableIframeProps> = ({ src }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const panZoomInstance = panzoom(containerRef.current);

      // Cleanup panzoom instance on unmount
      return () => {
        panZoomInstance.dispose();
      };
    }
  }, []);

  return (
    <div
      className="iframe-container h-96 w-full overflow-hidden border"
      ref={containerRef}
    >
      <iframe src={src} className="h-full w-full" title="Document Preview" />
    </div>
  );
};

export default ZoomableIframe;
