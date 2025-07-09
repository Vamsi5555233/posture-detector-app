import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  // Mode: either 'upload' or 'webcam'
  const [mode, setMode] = useState('upload');

  // Selected video file (either uploaded or recorded)
  const [selectedFile, setSelectedFile] = useState(null);

  // Message shown after upload (success/failure)
  const [uploadMessage, setUploadMessage] = useState('');

  // Stores feedback from backend (list of bad posture frames)
  const [badFrames, setBadFrames] = useState([]);

  // Preview URL for selected or recorded video
  const [videoPreview, setVideoPreview] = useState(null);

  // States and refs for webcam recording
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const webcamRef = useRef(null);
  const recordedChunks = useRef([]);

  // Toggle between 'upload' and 'webcam' mode
  const handleModeChange = (e) => {
    setMode(e.target.value);
    setUploadMessage('');
    setBadFrames([]);
    setSelectedFile(null);
    setVideoPreview(null);
  };

  // Handle video file selection from local device
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadMessage('');
    setBadFrames([]);
    setVideoPreview(URL.createObjectURL(file)); // show preview
  };

  // Upload video to backend for posture analysis
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select or record a video first.');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData);
      const { feedback } = response.data;
      setBadFrames(feedback);
      setUploadMessage(`Upload successful. Bad posture detected in ${feedback.length} frame(s).`);
    } catch (error) {
      console.error(error);
      setUploadMessage('Upload failed. Please try again.');
    }
  };

  // Start webcam and begin recording
  const startRecording = async () => {
    setUploadMessage('');
    setBadFrames([]);
    recordedChunks.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamRef.current.srcObject = stream;
      webcamRef.current.play();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Convert recorded chunks to file and generate preview
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const file = new File([blob], 'recorded_video.webm', { type: 'video/webm' });
        setSelectedFile(file);
        setVideoPreview(URL.createObjectURL(blob));

        // Stop webcam stream
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Webcam access error:', err);
    }
  };

  // Stop the recording process
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🪑 Bad Posture Detection App</h2>

      {/* Mode selection: Upload or Webcam */}
      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            type="radio"
            value="upload"
            checked={mode === 'upload'}
            onChange={handleModeChange}
          />
          Upload Video
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            value="webcam"
            checked={mode === 'webcam'}
            onChange={handleModeChange}
          />
          Use Webcam
        </label>
      </div>

      {/* Upload input */}
      {mode === 'upload' && (
        <input type="file" accept="video/*" onChange={handleFileChange} />
      )}

      {/* Webcam video and record/stop buttons */}
      {mode === 'webcam' && (
        <div style={{ marginBottom: '15px' }}>
          <video
            ref={webcamRef}
            width="480"
            height="360"
            autoPlay
            muted
            style={{ border: '1px solid black' }}
          ></video>
          <br />
          {!recording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording} style={{ backgroundColor: 'red', color: 'white' }}>
              Stop Recording
            </button>
          )}
        </div>
      )}

      {/* Upload button */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* Upload success/failure message */}
      {uploadMessage && (
        <div style={{ marginTop: '15px', fontWeight: 'bold', color: 'darkred' }}>
          {uploadMessage}
        </div>
      )}

      {/* Display feedback for detected bad posture frames */}
      {badFrames.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          maxHeight: '250px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          fontSize: '14px'
        }}>
          <strong>Detected Posture Issues:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '15px' }}>
            {badFrames.map((entry, index) => (
              <li key={index}>
                <strong>Frame {entry.frame}:</strong> {entry.issues.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Video playback preview */}
      {videoPreview && (
        <div style={{ marginTop: '20px' }}>
          <video width="480" controls>
            <source src={videoPreview} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default App;
