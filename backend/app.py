from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from logic.pose_utils import analyze_posture

# Initialize the Flask application
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing so frontend can communicate with backend
CORS(app)

# Set up the folder where uploaded videos will be saved
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define the allowed file extensions for uploads
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'webm'}

# Helper function to validate file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to handle video upload and posture analysis
@app.route('/upload', methods=['POST'])
def upload_video():
    # Check if the request contains a file
    if 'video' not in request.files:
        return jsonify({"message": "No video file provided"}), 400

    video = request.files['video']

    # Ensure the user actually selected a file
    if video.filename == '':
        return jsonify({"message": "No selected file"}), 400

    # Check file type and process the video
    if video and allowed_file(video.filename):
        filename = secure_filename(video.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video.save(save_path)

        try:
            # Run the posture analysis function and return the results
            feedback = analyze_posture(save_path)
            return jsonify({
                "message": f"Bad posture detected in {len(feedback)} frame(s).",
                "feedback": feedback
            })
        except Exception as e:
            # Handle unexpected processing errors
            return jsonify({"message": f"Error processing video: {str(e)}"}), 500
    else:
        # Reject unsupported file types
        return jsonify({"message": "Invalid file type"}), 400

# Basic route to verify backend is running
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong"})

# Run the app locally in debug mode
if __name__ == '__main__':
    app.run(debug=True)
