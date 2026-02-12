import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as demo from '../demoData';

export function useDemoFetch(supabaseFetcher, demoKey, filterFn) {
  const { isDemo } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (isDemo) {
      const raw = demo[demoKey] || [];
      setData(filterFn ? raw.filter(filterFn) : raw);
      setLoading(false);
      return Promise.resolve();
    }
    return supabaseFetcher()
      .then(d => { setData(filterFn ? d.filter(filterFn) : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isDemo, supabaseFetcher, demoKey, filterFn]);

  useEffect(() => { load(); }, [load]);

  return { data, setData, loading, reload: load };
}
