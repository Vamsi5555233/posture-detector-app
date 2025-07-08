import React, { useState } from 'react';
import axios from 'axios';

// This component allows the user to upload a video file
function VideoUpload() {
  // State to store the selected video file
  const [selectedFile, setSelectedFile] = useState(null);
  
  // State to store messages for the user
  const [message, setMessage] = useState("");

  // Called when the user picks a file
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Called when the user clicks "Upload"
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a video file first!");
      return;
    }

    // Prepare the file to send to backend using FormData
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      setMessage("Uploading...");

      // Send POST request to backend with the video
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show response message from backend
      setMessage(response.data.message || "Upload successful!");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Upload a Video File</h3>

      {/* Input for selecting video */}
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br />

      {/* Upload button */}
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        Upload
      </button>

      {/* Message shown to user */}
      <p>{message}</p>
    </div>
  );
}

export default VideoUpload;
