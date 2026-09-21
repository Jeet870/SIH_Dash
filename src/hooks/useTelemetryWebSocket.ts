'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { TelemetryRecord } from '@/types/telemetry';

export function useTelemetryWebSocket(wsUrl?: string, wellId = 'BW-001') {
  const url = wsUrl || process.env.NEXT_PUBLIC_INGESTION_WS_URL || 'http://localhost:3002';
  const [latest, setLatest] = useState<TelemetryRecord | null>(null);
  const [history, setHistory] = useState<TelemetryRecord[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 1. Initial REST fetch so graphs aren't blank
    fetch(`${url}/api/v1/telemetry/history?well_id=${wellId}&limit=35`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          const chronological = data.data.reverse();
          setHistory(chronological);
          if (chronological.length > 0) {
            setLatest(chronological[chronological.length - 1]);
          }
        }
      })
      .catch((err) => console.warn('Initial telemetry fetch fallback:', err));

    // 2. Establish WebSocket connection
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Ingestion WebSocket gateway');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Ingestion WebSocket gateway');
      setIsConnected(false);
    });

    socket.on('telemetry', (record: TelemetryRecord) => {
      if (!record || record.well_id !== wellId) return;
      setLatest(record);
      setHistory((prev) => {
        const next = [...prev, record];
        return next.length > 40 ? next.slice(next.length - 40) : next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [url, wellId]);

  return { latest, history, isConnected };
}
