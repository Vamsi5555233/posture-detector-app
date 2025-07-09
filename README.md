#  Bad Posture Detection App

A simple full-stack posture analysis web app that helps users detect bad posture while squatting or sitting using either an uploaded video or their webcam. The detection is based on rule-based logic applied to keypoints extracted from each video frame.

##  Tech Stack

- **Frontend:** React (with webcam + file upload support)
- **Backend:** Flask (Python) + OpenCV + MediaPipe
- **Pose Detection:** MediaPipe's Pose module
- **Deployment Platforms:** 
  - Frontend on **Vercel**
  - Backend on **Render**
  
##  Features

- Upload a pre-recorded video or record directly from webcam
- Frame-by-frame analysis using rule-based posture checks
- Shows number of frames with bad posture
- Real-time feedback message after upload
- Supports `.mp4`, `.webm`, `.mov`, `.avi` video formats

##  Rule-Based Detection Logic

The backend uses simple but effective rules to identify poor posture:

###  Squat Detection
- **Back angle < 150°** → counted as bad form
- **Knee goes beyond toe** → flagged as bad squat

###  Desk Sitting Detection
- **Neck bend > 30°**
- **Non-straight back posture**

Pose estimation is done using **MediaPipe** and each frame is evaluated based on these rules.

---

##  Deployment Links

-  **Live App:**    https://posture-detector-kh866h4h8-vamsis-projects-38f3ecaf.vercel.app/
-  **Backend API:** https://your-backend.up.railway.app (but it is crashing due to lack of support with OpenCV)
-  **Demo Video:**  https://drive.google.com/file/d/1RpCmPp48CIIo0_b-T98Y8EUsXphv_gle/view?usp=sharing

---

##  Folder Structure

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

---

##  How to Run the Project Locally

 Prerequisites
Python 3.9+ (Preferred 3.9.13)

Node.js (v14+ recommended)

npm or yarn

pip for Python packages

 1. Clone the Repository

git clone https://github.com/Vamsi5555233/posture-detector-app.git
cd posture-detector-app
 2. Setup Backend (Flask + MediaPipe)

cd backend
python -m venv venv
venv\Scripts\activate         # On Windows
# Or
source venv/bin/activate     # On macOS/Linux

pip install -r requirements.txt
python app.py
The backend will start on http://127.0.0.1:5000 by default.

Test the backend via browser:
http://127.0.0.1:5000/ping → Should return { "message": "pong" }

 3. Setup Frontend (React)

cd ../frontend
npm install
 Add Environment Variable
Create a .env file inside the frontend/ folder and add:

env

REACT_APP_API_URL=http://127.0.0.1:5000
 4. Run Frontend

npm start
Visit the frontend in your browser at:
http://localhost:3000

 Now you can:
Upload a video or record from webcam

Get real-time feedback on poor posture frames
