export const runtime = 'edge';

function formatStars(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(count);
}

// Cache for 5 minutes (300 seconds) with shorter stale-while-revalidate
const CACHE_TTL = 300;
const STALE_TTL = 3600; // 1 hour

export async function GET() {
  const repo = 'dodopayments/billingsdk';
  const url = `https://api.github.com/repos/${repo}`;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'billingsdk-site',
  };

  // Create AbortController with timeout
  const controller = new AbortController();
  const timeout = 5000; // 5 seconds
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { 
      headers, 
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      signal: controller.signal
    });
    
    // Clear timeout since fetch completed
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const fallback = { stars: null, pretty: null, forks: null, forksPretty: null };
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': `s-maxage=${CACHE_TTL / 6}, stale-while-revalidate=${STALE_TTL / 6}`,
        },
      });
    }
    
    const data = await response.json();
    const stars = Number(data.stargazers_count ?? 0);
    const forks = Number(data.forks_count ?? 0);
    const body = { stars, pretty: formatStars(stars), forks, forksPretty: formatStars(forks) };
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': `s-maxage=${CACHE_TTL}, stale-while-revalidate=${STALE_TTL}`,
      },
    });
  } catch (error) {
    // Clear timeout in case of error
    clearTimeout(timeoutId);
    
    // Handle abort error specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(JSON.stringify({ 
        stars: null, 
        pretty: null, 
        forks: null, 
        forksPretty: null,
        error: 'Request timeout'
      }), {
        status: 408,
        headers: {
          'content-type': 'application/json',
          'cache-control': `s-maxage=60, stale-while-revalidate=600`,
        },
      });
    }
    
    const fallback = { stars: null, pretty: null, forks: null, forksPretty: null };
    return new Response(JSON.stringify(fallback), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': `s-maxage=${CACHE_TTL / 6}, stale-while-revalidate=${STALE_TTL / 6}`,
      },
    });
  }
}