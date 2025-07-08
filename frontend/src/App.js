import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [mode, setMode] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [badFrames, setBadFrames] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const webcamRef = useRef(null);
  const recordedChunks = useRef([]);

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setUploadMessage('');
    setBadFrames([]);
    setSelectedFile(null);
    setVideoPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadMessage('');
    setBadFrames([]);
    setVideoPreview(URL.createObjectURL(file));
  };

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
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const file = new File([blob], 'recorded_video.webm', { type: 'video/webm' });
        setSelectedFile(file);
        setVideoPreview(URL.createObjectURL(blob));

        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Webcam access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🪑 Bad Posture Detection App</h2>

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

      {mode === 'upload' && (
        <input type="file" accept="video/*" onChange={handleFileChange} />
      )}

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

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleUpload}>Upload</button>
      </div>

      {uploadMessage && (
        <div style={{ marginTop: '15px', fontWeight: 'bold', color: 'darkred' }}>
          {uploadMessage}
        </div>
      )}

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
