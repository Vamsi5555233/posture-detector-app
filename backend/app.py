from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from logic.pose_utils import analyze_posture

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"message": "No video file provided"}), 400

    video = request.files['video']
    if video.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if video and allowed_file(video.filename):
        filename = secure_filename(video.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video.save(save_path)

        try:
            feedback = analyze_posture(save_path)
            return jsonify({
                "message": f"Bad posture detected in {len(feedback)} frame(s).",
                "feedback": feedback
            })
        except Exception as e:
            return jsonify({"message": f"Error processing video: {str(e)}"}), 500
    else:
        return jsonify({"message": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True)
