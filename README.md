# 🧍‍♂️ Bad Posture Detection App

A simple full-stack posture analysis web app that helps users detect bad posture while squatting or sitting using either an uploaded video or their webcam. The detection is based on rule-based logic applied to keypoints extracted from each video frame.

---

## 🔧 Tech Stack

- **Frontend:** React (with webcam + file upload support)
- **Backend:** Flask (Python) + OpenCV + MediaPipe
- **Pose Detection:** MediaPipe's Pose module
- **Deployment Platforms:**  
  - Frontend: **Vercel**  
  - Backend: **Render** *(note: OpenCV crashes due to libGL.so.1 issue on free tier)*

---

## 💡 Features

- Upload a pre-recorded video or record directly from webcam
- Frame-by-frame analysis using rule-based posture checks
- Shows number of frames with bad posture
- Real-time feedback message after upload
- Supports `.mp4`, `.webm`, `.mov`, `.avi` video formats

---

## 🧠 Rule-Based Detection Logic

### 🔸 Squat Detection
- **Back angle < 150°** → counted as bad form
- **Knee goes beyond toe** → flagged as bad squat

### 🔸 Desk Sitting Detection
- **Neck bend > 30°**
- **Non-straight back posture**

Pose estimation is done using **MediaPipe**, and each frame is evaluated based on these rules.

---

## 🚀 Deployment Links

- 🔗 **Live App:** https://posture-detector-kh866h4h8-vamsis-projects-38f3ecaf.vercel.app/
- 🔗 **Backend API:** https://your-backend.up.railway.app *(not stable due to OpenCV issue on Render)*
- 🎥 **Demo Video:** https://drive.google.com/file/d/1RpCmPp48CIIo0_b-T98Y8EUsXphv_gle/view?usp=sharing

---

## 📁 Folder Structure

```
bad-posture-detector/
├── frontend/
│   ├── App.js
│   ├── index.js
│   ├── .env
│   └── ... (React files)
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── logic/
│   │   └── pose_utils.py
│   └── uploads/
└── README.md
```

---

## 🖥️ How to Run the Project Locally

### ✅ Prerequisites

- Python 3.9+ (Recommended: **3.9.13**)
- Node.js (v14+)
- npm or yarn
- pip for Python packages

---

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/Vamsi5555233/posture-detector-app.git
cd posture-detector-app
```

---

### 🔹 2. Setup Backend (Flask + MediaPipe)

```bash
cd backend
python -m venv venv
venv\Scripts\activate         # On Windows
# or
source venv/bin/activate     # On macOS/Linux

pip install -r requirements.txt
python app.py
```

- Backend will run at: `http://127.0.0.1:5000`

- Test it in browser:  
  [http://127.0.0.1:5000/ping](http://127.0.0.1:5000/ping)  
  → Should return: `{ "message": "pong" }`

---

### 🔹 3. Setup Frontend (React)

```bash
cd ../frontend
npm install
```

#### 📄 Add Environment Variable

Create a `.env` file in `frontend/` folder and add:

```env
REACT_APP_API_URL=http://127.0.0.1:5000
```

---

### 🔹 4. Run Frontend

```bash
npm start
```

- Visit the app at: `http://localhost:3000`

---

## 🧪 What You Can Do

- Upload a video or record using webcam
- See posture analysis frame-by-frame
- Get feedback like:
  - "Back angle < 150° (possible hunch)"
  - "Neck appears slouched"
  - "Knee ahead of toe (possible poor squat form)"

---

## ⚠️ Known Issue

- Backend crashes on free Railway/Render deployment due to `libGL.so.1` not being present (required by OpenCV).
- For full functionality, run locally or deploy on a VPS with OpenCV dependencies.

---
