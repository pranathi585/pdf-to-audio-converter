# from flask import Flask, render_template, request, send_file
# import pdfplumber
# import pyttsx3
# import os

# app = Flask(__name__)

# @app.route('')
# def index():
#     return render_template('index.html')

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return 'No file part'
    
#     file = request.files['file']
#     if file.filename == '':
#         return 'No selected file'
    
#     if file and file.filename.endswith('.pdf'):
        
#         pdf_path = os.path.join('uploads', file.filename)
#         file.save(pdf_path)

    
#         text = ''
#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 text += page.extract_text()

         
#         engine = pyttsx3.init()
#         audio_path = pdf_path.replace('.pdf', '.mp3')
#         engine.save_to_file(text, audio_path)
#         engine.runAndWait()

#         return send_file(audio_path, as_attachment=True)

#     return 'Invalid file format'

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, render_template, request, send_file, redirect, url_for
import pdfplumber
import pyttsx3
import os

app = Flask(__name__)

# Ensure the uploads directory exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    # Render the initial homepage
    return render_template('home.hbs')  # Assuming your starting file is home.hbs

@app.route('/convert', methods=['POST'])
def convert():
    # Handle the uploaded file
    if 'pdf' not in request.files:
        return "No file part", 400

    file = request.files['pdf']
    if file.filename == '':
        return "No selected file", 400

    if file and file.filename.endswith('.pdf'):
        # Save the uploaded PDF
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(pdf_path)

        # Extract text from the PDF
        text = ''
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text()

        # Convert the extracted text to audio
        engine = pyttsx3.init()
        audio_path = pdf_path.replace('.pdf', '.mp3')
        engine.save_to_file(text, audio_path)
        engine.runAndWait()

        # Redirect to a page rendering index.hbs with download info
        return render_template('index.hbs', audio_path=audio_path, filename=os.path.basename(audio_path))

    return "Invalid file format", 400


@app.route('/download/<filename>')
def download(filename):
    # Serve the generated audio file
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
