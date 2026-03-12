from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import random

app = Flask(__name__)
CORS(app)

# Load the model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None
    print("WARNING: model.pkl not found. Run model_trainer.py first.")

@app.route('/api/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded on server.'}), 500
        
    try:
        data = request.json
        # Expecting: Age, Cycle_Length, Period_Duration, Pain_Level, Flow_Intensity, Mood_Changes
        
        # Convert dictionary to DataFrame for XGBoost to match training feature names
        features = ['Age', 'Cycle_Length', 'Period_Duration', 'Pain_Level', 'Flow_Intensity', 'Mood_Changes']
        input_data = {k: [int(data.get(k, 0))] for k in features}
        df = pd.DataFrame(input_data)
        
        prediction = model.predict(df)[0]
        
        results = {
            0: {"prediction": "Normal Cycle", "recommendation": "Maintain your healthy habits!"},
            1: {"prediction": "Possible Irregularity", "recommendation": "Monitor your cycle next month and stay hydrated."},
            2: {"prediction": "High Risk – Consult Doctor", "recommendation": "Please consult a healthcare provider given your symptoms."}
        }
        
        return jsonify(results.get(int(prediction), results[0]))
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/posts', methods=['GET'])
def get_posts():
    mock_posts = [
        {
            "id": 1,
            "doctorName": "Dr. Sarah Jenkins",
            "verified": True,
            "profileImage": "https://i.pravatar.cc/150?img=1",
            "title": "Understanding PCOS",
            "content": "Polycystic ovary syndrome (PCOS) is a common hormonal disorder common among women of reproductive age. Symptoms include irregular periods and excess androgen levels. Early diagnosis is key.",
            "likes": 124,
            "comments": 15
        },
        {
            "id": 2,
            "doctorName": "Dr. Emily Chen",
            "verified": True,
            "profileImage": "https://i.pravatar.cc/150?img=5",
            "title": "Nutrition for Hormonal Balance",
            "content": "A balanced diet rich in Omega-3 fatty acids, leafy greens, and lean proteins can significantly impact hormonal stability throughout your cycle.",
            "likes": 89,
            "comments": 7
        },
        {
            "id": 3,
            "doctorName": "Dr. Ayesha Rahman",
            "verified": True,
            "profileImage": "https://i.pravatar.cc/150?img=9",
            "title": "Debunking Menstruation Myths",
            "content": "There are many myths surrounding menstruation. Exercise is actually beneficial during your period, contrary to popular belief, as it can help relieve cramps.",
            "likes": 210,
            "comments": 42
        }
    ]
    return jsonify(mock_posts)

@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    questions = [
        {
            "id": 1,
            "question": "What is the average length of a normal menstrual cycle?",
            "options": ["15-20 days", "21-35 days", "40-45 days", "50+ days"],
            "correctAnswer": 1
        },
        {
            "id": 2,
            "question": "Which hormone is primarily responsible for triggering ovulation?",
            "options": ["Progesterone", "Estrogen", "Luteinizing Hormone (LH)", "Testosterone"],
            "correctAnswer": 2
        },
        {
            "id": 3,
            "question": "True or False: Irregular periods during the first few years of menstruation are always a sign of a severe health condition.",
            "options": ["True", "False"],
            "correctAnswer": 1
        }
    ]
    return jsonify(questions)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
