import pickle
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import xgboost as xgb

class MLPredictor:
    def __init__(self):
        self.models = {}
        self.load_models()
    
    def load_models(self):
        model_path = Path(__file__).parent.parent / "ml_models"
        
        try:
            with open(model_path / "xgboost_model.pkl", "rb") as f:
                self.models['xgboost'] = pickle.load(f)
        except FileNotFoundError:
            print("XGBoost model not found")
            
        try:
            with open(model_path / "random_forest_model.pkl", "rb") as f:
                self.models['random_forest'] = pickle.load(f)
        except FileNotFoundError:
            print("Random Forest model not found")
            
        try:
            with open(model_path / "logistic_model.pkl", "rb") as f:
                self.models['logistic'] = pickle.load(f)
        except FileNotFoundError:
            print("Logistic Regression model not found")
    
    def predict(self, data: dict):
        features = ['Age', 'Cycle_Length', 'Period_Duration', 'Pain_Level', 'Flow_Intensity', 'Mood_Changes']
        input_data = {k: [int(data.get(k, 0))] for k in features}
        df = pd.DataFrame(input_data)
        
        predictions = []
        confidences = []
        
        # Ensemble prediction
        for model_name, model in self.models.items():
            if model:
                pred = model.predict(df)[0]
                predictions.append(pred)
                
                # Get probability if available
                if hasattr(model, 'predict_proba'):
                    proba = model.predict_proba(df)[0]
                    confidences.append(max(proba))
        
        # Majority voting
        if predictions:
            final_prediction = int(np.bincount(predictions).argmax())
            avg_confidence = np.mean(confidences) if confidences else 0.0
        else:
            final_prediction = 0
            avg_confidence = 0.0
        
        results = {
            0: {"prediction": "Normal Cycle", "recommendation": "Maintain your healthy habits!"},
            1: {"prediction": "Possible Irregularity", "recommendation": "Monitor your cycle next month and stay hydrated."},
            2: {"prediction": "High Risk – Consult Doctor", "recommendation": "Please consult a healthcare provider given your symptoms."}
        }
        
        result = results.get(final_prediction, results[0])
        result['confidence'] = round(avg_confidence * 100, 2)
        
        return result

ml_predictor = MLPredictor()
