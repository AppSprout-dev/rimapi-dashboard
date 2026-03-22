import { useState, useEffect, useCallback } from 'react';
import { RleTickData, RleScore } from '@/components/widgets/rle/types';

const RLE_POLL_URL = 'http://localhost:9000/latest_tick.json';
const POLL_INTERVAL_MS = 2000;

export function useRleTickData() {
  const [tickData, setTickData] = useState<RleTickData | null>(null);
  const [scoreHistory, setScoreHistory] = useState<RleScore[]>([]);
  const [connected, setConnected] = useState(false);

  const fetchTick = useCallback(async () => {
    try {
      const resp = await fetch(RLE_POLL_URL);
      if (!resp.ok) {
        setConnected(false);
        return;
      }
      const data: RleTickData = await resp.json();
      setTickData((prev) => {
        if (prev?.tick === data.tick) return prev;
        if (data.score) {
          setScoreHistory((h) => [...h.slice(-99), data.score!]);
        }
        return data;
      });
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchTick();
    const id = setInterval(fetchTick, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchTick]);

  return { tickData, scoreHistory, connected };
}
