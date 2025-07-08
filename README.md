# 🧍‍♂️ Bad Posture Detection App

A simple full-stack posture analysis web app that helps users detect bad posture while squatting or sitting using either an uploaded video or their webcam. The detection is based on rule-based logic applied to keypoints extracted from each video frame.

## 🔧 Tech Stack

- **Frontend:** React (with webcam + file upload support)
- **Backend:** Flask (Python) + OpenCV + MediaPipe
- **Pose Detection:** MediaPipe's Pose module
- **Deployment Platforms:** 
  - Frontend on **Vercel**
  - Backend on **Render**
  
## 💡 Features

- Upload a pre-recorded video or record directly from webcam
- Frame-by-frame analysis using rule-based posture checks
- Shows number of frames with bad posture
- Real-time feedback message after upload
- Supports `.mp4`, `.webm`, `.mov`, `.avi` video formats

## 🧠 Rule-Based Detection Logic

The backend uses simple but effective rules to identify poor posture:

### 🔸 Squat Detection
- **Back angle < 150°** → counted as bad form
- **Knee goes beyond toe** → flagged as bad squat

### 🔸 Desk Sitting Detection
- **Neck bend > 30°**
- **Non-straight back posture**

Pose estimation is done using **MediaPipe** and each frame is evaluated based on these rules.

---

## 🚀 Deployment Links

- 🔗 **Live App:** [https://your-frontend-link.vercel.app](https://your-frontend-link.vercel.app)
- 🔗 **Backend API:** [https://your-backend-api.onrender.com](https://your-backend-api.onrender.com)
- 🎥 **Demo Video:** [https://drive.google.com/your-demo-video-link](https://drive.google.com/your-demo-video-link)

---

## 📂 Folder Structure

```bash
bad-posture-detector/
├── frontend/
│   └── (React frontend files)
├── backend/
│   ├── app.py
│   ├── logic/
│   │   └── pose_utils.py
│   └── uploads/
└── README.md

