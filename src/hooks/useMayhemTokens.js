import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { fetchMayhemTokens, generateMockTokens } from '../services/pumpfun.js';

const POLL_INTERVAL_MS = 30_000;

const sortTokensByCreated = (tokens) =>
  [...tokens].sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());

const useMayhemTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [source, setSource] = useState('mock');
  const intervalRef = useRef(null);

  const loadTokens = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const { tokens: fetchedTokens, source: origin } = await fetchMayhemTokens();
      setTokens(sortTokensByCreated(fetchedTokens));
      setLastUpdated(new Date());
      setSource(origin);
      setError(
        origin === 'mock'
          ? 'DexScreener Mayhem feed unavailable. Displaying simulated radar data until connectivity returns.'
          : null,
      );
    } catch (err) {
      console.error('Unable to load Mayhem tokens, using mock data.', err);
      const fallback = generateMockTokens();
      setTokens(sortTokensByCreated(fallback));
      setLastUpdated(new Date());
      setSource('mock');
      setError(
        'Unable to reach DexScreener pump.fun stream. Showing simulated data until the live feed reconnects.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTokens();

    intervalRef.current = setInterval(() => {
      loadTokens({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadTokens]);

  const refresh = useCallback(() => loadTokens(), [loadTokens]);

  return {
    tokens,
    loading,
    error,
    lastUpdated,
    refresh,
    source,
  };
};

export default useMayhemTokens;

