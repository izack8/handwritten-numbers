import { useRef, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config';

const DrawingCanvas = ({ onDrawingComplete, width = 28, height = 28, scale = 10 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');

    // Set up canvas
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 1; // Adjust line width for smaller canvas
    context.strokeStyle = '#000000';

    // Clear canvas with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
  }, [width, height]);

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches[0]) {
      // Touch event
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      // Mouse event
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const position = getPosition(e);
    setLastPosition(position);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const currentPosition = getPosition(e);

    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();

    setLastPosition(currentPosition);
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      if (onDrawingComplete) {
        const canvas = canvasRef.current;
        if (canvas) {
          const imageData = canvas.toDataURL();
          onDrawingComplete(imageData);
        }
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    if (onDrawingComplete) {
      onDrawingComplete(null);
    }
  };

  const predict = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert the canvas content to a Blob
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'drawing.png'); // Append the Blob as a file

      try {
        // Send the FormData to the FastAPI endpoint
        const response = await fetch(API_ENDPOINTS.predict, {
          method: 'POST',
          body: formData, // Send as FormData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Prediction:', data.prediction); // Log the predicted digit
        alert(`Predicted digit: ${data.prediction}`); // Show the prediction to the user
      } catch (error) {
        console.error('Error during prediction:', error);
        alert('Failed to predict. Please try again.');
      }
    }, 'image/png'); // Specify the image format
  };

  return (
    <div className="flex flex-col items-center gap-5 p-10">
      {/* Scale the canvas for better visibility */}
      <div
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #333',
          backgroundColor: '#fff',
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            width: `${width * scale}px`,
            height: `${height * scale}px`,
          }}
          className="cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="mt-5 flex flex-row gap-4">
        <button
          onClick={predict}
          className="w-30 px-5 py-2.5 text-base bg-red-500 text-white border-none rounded cursor-pointer transition-colors duration-300 hover:bg-red-600"
        >
          Predict
        </button>
        <button
          onClick={clearCanvas}
          className="w-30 px-5 py-2.5 text-base bg-red-500 text-white border-none rounded cursor-pointer transition-colors duration-300 hover:bg-red-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;