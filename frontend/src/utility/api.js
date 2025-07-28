// Centralized API endpoints and axios instance for EV Dashboard
import axios from "axios";

export const API_BASE_URL = "https://ev-dashboard-1a32.vercel.app/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const fetchChargingStations = (params = {}) =>
  api.get("/charging-stations", { params });

export const fetchEVModels = () =>
  api.get("/ev-models");

export const fetchAnalytics = () =>
  api.get("/analytics");
