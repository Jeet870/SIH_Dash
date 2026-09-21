'use client';

import { useState, useEffect } from 'react';
import { AnalyticsData, PredictionsData, WellHealthScore } from '@/types/telemetry';

export function usePredictions(apiUrl?: string, wellId = 'BW-001', intervalMs = 3500) {
  const url = apiUrl || process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [predictions, setPredictions] = useState<PredictionsData | null>(null);
  const [healthScore, setHealthScore] = useState<WellHealthScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchResults = async () => {
    try {
      const res = await fetch(`${url}/api/v1/pipeline/latest?well_id=${wellId}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();

      if (json?.data) {
        const d = json.data;
        if (d.analytics) {
          setAnalytics(d.analytics);
          if (d.analytics.well_health_score) {
            setHealthScore(d.analytics.well_health_score);
          }
        }
        if (d.predictions) {
          setPredictions(d.predictions);
        }
        setLastUpdated(new Date());
      }
      setIsLoading(false);
    } catch (err) {
      console.warn('Error polling predictions/analytics:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, intervalMs);
    return () => clearInterval(interval);
  }, [url, wellId, intervalMs]);

  return { analytics, predictions, healthScore, isLoading, lastUpdated, refetch: fetchResults };
}
