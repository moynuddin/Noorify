const CACHE_NAME = 'quran-offline-v1';

export async function fetchWithCache(url: string, forceNetwork = false) {
  if (typeof window === 'undefined' || !('caches' in window)) {
    const res = await fetch(url);
    return res.json();
  }

  const cache = await caches.open(CACHE_NAME);

  if (!forceNetwork) {
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      return cachedResponse.json();
    }
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      cache.put(url, response.clone());
    }
    return response.json();
  } catch (error) {
    // If network fails (offline), attempt fallback
    const fallbackResponse = await cache.match(url);
    if (fallbackResponse) {
      return fallbackResponse.json();
    }
    throw error;
  }
}

export async function downloadSurahOffline(id: number): Promise<void> {
  const arUrl = `https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`;
  const enUrl = `https://api.alquran.cloud/v1/surah/${id}/en.asad`;
  // Force network to ensure we get a fresh copy and put to cache
  await fetchWithCache(arUrl, true);
  await fetchWithCache(enUrl, true);
}

export async function removeSurahFromCache(id: number): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  const cache = await caches.open(CACHE_NAME);
  const arUrl = `https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`;
  const enUrl = `https://api.alquran.cloud/v1/surah/${id}/en.asad`;
  await cache.delete(arUrl);
  await cache.delete(enUrl);
}
