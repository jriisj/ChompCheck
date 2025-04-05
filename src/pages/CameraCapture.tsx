import React, { useRef, useState, useEffect } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Unable to access the camera.");
        console.error(err);
      }
    };

    getCameraStream();
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhoto(dataUrl);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl shadow-md w-full max-w-md"
      />
      <div>
        <button
          onClick={capturePhoto}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Capture Photo
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {photo && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Captured Photo:</h3>
          <img src={photo} alt="Captured" className="mt-2 rounded-xl shadow" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
