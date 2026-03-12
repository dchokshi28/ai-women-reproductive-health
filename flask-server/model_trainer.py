import pandas as pd
import numpy as np
import xgboost as xgb
import pickle

def create_mock_dataset():
    # Features: Age, Cycle length, Period duration, Pain level, Flow intensity, Mood changes
    # Output Classes: Normal Cycle (0), Possible Irregularity (1), High Risk (2)
    np.random.seed(42)
    n_samples = 500
    
    data = {
        'Age': np.random.randint(18, 50, n_samples),
        'Cycle_Length': np.random.randint(21, 40, n_samples),
        'Period_Duration': np.random.randint(2, 9, n_samples),
        'Pain_Level': np.random.randint(1, 6, n_samples),
        'Flow_Intensity': np.random.randint(1, 4, n_samples), # 1: Low, 2: Medium, 3: High
        'Mood_Changes': np.random.randint(1, 6, n_samples), # 1: Low, 5: High
    }
    
    df = pd.DataFrame(data)
    
    # Simple heuristics to generate labels for the MVP
    conditions = [
        # High Risk: Long/Short cycles + high pain + long duration
        (df['Cycle_Length'] > 35) & (df['Pain_Level'] >= 4) | (df['Cycle_Length'] < 24) & (df['Period_Duration'] > 7),
        # Possible Irregularity: slightly off cycles or moderate pain
        (df['Cycle_Length'] > 31) | (df['Cycle_Length'] < 26) | (df['Pain_Level'] == 3),
    ]
    
    # 0 = Normal, 1 = Irregular, 2 = High Risk
    df['Label'] = np.select(conditions, [2, 1], default=0)
    
    df.to_csv('dataset.csv', index=False)
    return df

def train_model(df):
    X = df.drop('Label', axis=1)
    y = df['Label']
    
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')
    model.fit(X, y)
    
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    print("Model trained and saved to model.pkl")

if __name__ == "__main__":
    df = create_mock_dataset()
    train_model(df)
