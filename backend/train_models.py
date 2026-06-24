import pandas as pd
import numpy as np
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from xgboost import XGBClassifier

def load_data():
    file_path = "pima.csv"
    columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']
    df = pd.read_csv(file_path, names=columns)
    
    # Replace zeros with NaNs for biological metrics where zero is physically impossible
    metrics_with_zeros = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    df[metrics_with_zeros] = df[metrics_with_zeros].replace(0, np.nan)
    
    # Fill NaNs with median of the column
    df.fillna(df.median(), inplace=True)
    
    return df

def train_and_evaluate():
    print("Loading and preprocessing data...")
    df = load_data()
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "SVM": SVC(probability=True, random_state=42),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }
    
    results = []
    best_model = None
    best_score = 0
    best_pipeline = None
    
    print("Training models...")
    for name, model in models.items():
        # Create pipeline with standard scaler
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', model)
        ])
        
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        y_prob = pipeline.predict_proba(X_test)[:, 1]
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_prob)
        
        metrics = {
            "name": name,
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1Score": float(f1),
            "rocAuc": float(roc_auc)
        }
        results.append(metrics)
        print(f"[{name}] Accuracy: {accuracy:.4f}, ROC-AUC: {roc_auc:.4f}")
        
        # We will use ROC-AUC to select the best model
        if roc_auc > best_score:
            best_score = roc_auc
            best_model = name
            best_pipeline = pipeline

    print(f"\nBest Model: {best_model} (ROC-AUC: {best_score:.4f})")
    
    # Save the best model
    joblib.dump(best_pipeline, 'best_model.joblib')
    print("Saved 'best_model.joblib'")
    
    # Save metrics
    with open('metrics.json', 'w') as f:
        json.dump(results, f, indent=4)
    print("Saved 'metrics.json'")

if __name__ == "__main__":
    train_and_evaluate()
