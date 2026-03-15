import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_squared_error
from pmdarima import auto_arima

# Load dataset
df = pd.read_csv("data/traffic.csv")

# Convert Date column
df['Date'] = pd.to_datetime(df['Date'])
df.set_index('Date', inplace=True)

# Convert numeric columns (remove commas)
cols = ['Page.Loads', 'Unique.Visits', 'First.Time.Visits', 'Returning.Visits']

for col in cols:
    df[col] = df[col].astype(str).str.replace(',', '')
    df[col] = pd.to_numeric(df[col])

print(df.head())

# Log transformation (improves forecasting)
df['log_visits'] = np.log(df['Unique.Visits'])

# Plot traffic
plt.figure(figsize=(10,5))
plt.plot(df['Unique.Visits'])
plt.title("Website Traffic Over Time")
plt.xlabel("Date")
plt.ylabel("Unique Visits")
plt.show()

# ADF Test
result = adfuller(df['log_visits'])
print("ADF Statistic:", result[0])
print("p-value:", result[1])

# Train/Test split
train = df[:-30]
test = df[-30:]

# AutoARIMA to find best parameters
auto_model = auto_arima(
    train['log_visits'],
    seasonal=True,
    m=7,          # weekly seasonality
    trace=True,
    stepwise=True
)

print(auto_model.summary())

# Train SARIMA using best parameters
model = SARIMAX(
    train['log_visits'],
    order=auto_model.order,
    seasonal_order=auto_model.seasonal_order
)

model_fit = model.fit()

print(model_fit.summary())

# Forecast
forecast_log = model_fit.forecast(steps=30)

# Convert back from log
forecast = np.exp(forecast_log)

# Plot results
plt.figure(figsize=(10,5))
plt.plot(test.index, test['Unique.Visits'], label='Actual')
plt.plot(test.index, forecast, label='Forecast')
plt.title("Traffic Forecast vs Actual")
plt.legend()
plt.show()

# RMSE calculation
rmse = np.sqrt(mean_squared_error(test['Unique.Visits'], forecast))

print("Improved RMSE:", rmse)

import pickle

with open("model.pkl", "wb") as f:
    pickle.dump(model_fit, f)
    