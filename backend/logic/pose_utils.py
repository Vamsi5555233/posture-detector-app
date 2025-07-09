import cv2
import mediapipe as mp
import math

# Initialize MediaPipe Pose module
mp_pose = mp.solutions.pose

# Function to calculate the angle between three points
def calculate_angle(a, b, c):
    ab = [a[0] - b[0], a[1] - b[1]]
    cb = [c[0] - b[0], c[1] - b[1]]
    dot = ab[0]*cb[0] + ab[1]*cb[1]  # Dot product of vectors
    mag_ab = math.hypot(*ab)  # Magnitude of vector ab
    mag_cb = math.hypot(*cb)  # Magnitude of vector cb

    # Avoid division by zero
    if mag_ab * mag_cb == 0:
        return 180  # Neutral angle

    # Calculate the angle in degrees
    angle = math.acos(dot / (mag_ab * mag_cb))
    return math.degrees(angle)

# Main function to analyze posture from a video file
def analyze_posture(video_path):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    feedback = []  # Stores posture issues detected per frame

    # Use MediaPipe's Pose model
    with mp_pose.Pose(static_image_mode=False, model_complexity=1, enable_segmentation=False) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break  # Exit when video ends
            frame_count += 1

            # Convert image to RGB for processing
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb)

            frame_issues = []  # Issues found in current frame

            # If landmarks are detected in the frame
            if results.pose_landmarks:
                lm = results.pose_landmarks.landmark

                try:
                    # Get coordinates of important body parts (left side)
                    shoulder = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                    hip = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x, lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                    knee = [lm[mp_pose.PoseLandmark.LEFT_KNEE.value].x, lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                    ankle = [lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
                    ear = [lm[mp_pose.PoseLandmark.LEFT_EAR.value].x, lm[mp_pose.PoseLandmark.LEFT_EAR.value].y]

                    # Calculate body angles
                    back_angle = calculate_angle(shoulder, hip, knee)
                    neck_angle = calculate_angle(ear, shoulder, hip)

                    # Rule-based posture checks
                    if back_angle < 150:
                        frame_issues.append("Back angle < 150° (possible hunch)")
                    if abs(knee[0] - ankle[0]) > 0.05 and knee[0] > ankle[0]:
                        frame_issues.append("Knee ahead of toe (possible poor squat form)")
                    if neck_angle < 140:
                        frame_issues.append("Neck appears slouched")

                except IndexError:
                    # Sometimes landmarks are incomplete or missing
                    frame_issues.append("Pose landmarks incomplete")

            # If any posture issues were detected, add them to feedback
            if frame_issues:
                feedback.append({"frame": frame_count, "issues": frame_issues})

    cap.release()  # Release video capture
    return feedback  # Return the list of detected issues
