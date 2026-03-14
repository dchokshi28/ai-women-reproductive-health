import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pickle

def create_enhanced_dataset():
    """Create a more comprehensive dataset for training"""
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'Age': np.random.randint(18, 50, n_samples),
        'Cycle_Length': np.random.randint(21, 40, n_samples),
        'Period_Duration': np.random.randint(2, 9, n_samples),
        'Pain_Level': np.random.randint(1, 6, n_samples),
        'Flow_Intensity': np.random.randint(1, 4, n_samples),
        'Mood_Changes': np.random.randint(1, 6, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Enhanced labeling logic
    conditions = [
        # High Risk: Severe symptoms
        ((df['Cycle_Length'] > 35) | (df['Cycle_Length'] < 24)) & 
        (df['Pain_Level'] >= 4) & 
        (df['Period_Duration'] > 7),
        
        # Possible Irregularity: Moderate symptoms
        ((df['Cycle_Length'] > 32) | (df['Cycle_Length'] < 26)) | 
        (df['Pain_Level'] >= 3) | 
        (df['Period_Duration'] > 6)
    ]
    
    df['Label'] = np.select(conditions, [2, 1], default=0)
    
    return df

def train_models():
    """Train multiple models for ensemble prediction"""
    print("Creating dataset...")
    df = create_enhanced_dataset()
    
    X = df.drop('Label', axis=1)
    y = df['Label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train XGBoost
    print("\nTraining XGBoost...")
    xgb_model = xgb.XGBClassifier(
        use_label_encoder=False,
        eval_metric='mlogloss',
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1
    )
    xgb_model.fit(X_train, y_train)
    xgb_pred = xgb_model.predict(X_test)
    print(f"XGBoost Accuracy: {accuracy_score(y_test, xgb_pred):.3f}")
    
    with open('xgboost_model.pkl', 'wb') as f:
        pickle.dump(xgb_model, f)
    
    # Train Random Forest
    print("\nTraining Random Forest...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    print(f"Random Forest Accuracy: {accuracy_score(y_test, rf_pred):.3f}")
    
    with open('random_forest_model.pkl', 'wb') as f:
        pickle.dump(rf_model, f)
    
    # Train Logistic Regression
    print("\nTraining Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train, y_train)
    lr_pred = lr_model.predict(X_test)
    print(f"Logistic Regression Accuracy: {accuracy_score(y_test, lr_pred):.3f}")
    
    with open('logistic_model.pkl', 'wb') as f:
        pickle.dump(lr_model, f)
    
    # Ensemble prediction
    print("\nEnsemble Prediction:")
    ensemble_pred = np.array([xgb_pred, rf_pred, lr_pred])
    final_pred = np.apply_along_axis(
        lambda x: np.bincount(x).argmax(), 
        axis=0, 
        arr=ensemble_pred
    )
    print(f"Ensemble Accuracy: {accuracy_score(y_test, final_pred):.3f}")
    
    print("\nClassification Report (Ensemble):")
    print(classification_report(y_test, final_pred, 
                                target_names=['Normal', 'Irregular', 'High Risk']))
    
    print("\nAll models saved successfully!")
    print("- xgboost_model.pkl")
    print("- random_forest_model.pkl")
    print("- logistic_model.pkl")

if __name__ == "__main__":
    train_models()
