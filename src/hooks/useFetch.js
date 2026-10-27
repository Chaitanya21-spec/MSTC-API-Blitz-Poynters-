import { useEffect, useState } from 'react';

export default function useFetch(url, enabled = true) {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  useEffect(() => {
    if (!enabled || !url) return;
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    fetch(url, { signal: controller.signal })
      .then((res) => { if (!res.ok) throw new Error('Something went wrong while fetching this content.'); return res.json(); })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ data: null, loading: false, error: error.message }); });
    return () => controller.abort();
  }, [url, enabled]);
  return state;
}
