import sys
import os
from PyPDF2 import PdfReader
from gtts import gTTS

def pdf_to_audio(pdf_path, audio_path):
    try:
        reader = PdfReader(pdf_path)
        text = ""

        for page in reader.pages:
            text += page.extract_text()

        if not text.strip():
            raise ValueError("No text found in the PDF.")

        tts = gTTS(text, lang="en")
        tts.save(audio_path)
        print(f"Audio saved to {audio_path}")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 app.py <pdf_path> <audio_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    audio_path = sys.argv[2]

    if not os.path.exists(pdf_path):
        print("Error: PDF file not found.")
        sys.exit(1)

    pdf_to_audio(pdf_path, audio_path)
