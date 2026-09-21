# THERMO-LIFT Next.js Operator Dashboard

Real-time operator command and analytics dashboard built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Socket.io Client**.

---

## 🚀 Key Features

1. **Real-time Telemetry Streaming via WebSocket:**
   - Connects to `data_ingestion` WebSocket gateway on port `3002`.
   - Displays real-time live pulse and stream latency.
   - Plots live time-series charts for:
     - Polished Rod Load (kN) & Surface Motor Current (A)
     - Production (BOPD) & Acoustic Fluid Level (m)
2. **Surface Dynamometer Card:**
   - Real-time closed-loop graph plotting instantaneous Polished Rod Load vs. Rod Position.
   - Computes and displays stroke work (kJ), card area (Joules), peak (PPRL), and minimum (MPRL) loads.
   - Displays plunger fillage % indicator.
3. **Periodic AI Prediction & Analytics Polling:**
   - Polls `ai_pipelines` / database on regular 3-second intervals.
   - Displays composite 0–100 **Well Health Score** gauge and 5-domain sub-scores (Thermal, Mechanical, Production Efficiency, Electrical, Sensor Health).
   - **Predictive Mechanical Risk Guard:** Rod floating probability, impact loading severity, rod string fatigue failure risk, and pump unsetting alarms.
   - **Multi-Horizon Forecasts:** 7d, 14d, and 30d forecasts for wellbore temperature, dynamic crude viscosity, oil production (BOPD), energy intensity (kWh/bbl), and Steam-to-Oil Ratio (SOR).
4. **Interactive Simulator Controls:**
   - Directly adjust temperature presets (80°C hot flush, 50°C baseline, 35°C cold shock), pumping speed (SPM), and tubing backpressure from the dashboard to observe real-time reactive graph changes.

---

## 🛠 Running the Dashboard

### Local Development
```bash
cd dashboard
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Compose
Run all 4 services (Simulator, Ingestion, AI Pipeline, and Dashboard) together:
```bash
docker compose up --build -d
```
Dashboard available at: **http://localhost:3000**
