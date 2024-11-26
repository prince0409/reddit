import axios from 'axios';

interface RateLimitState {
  remaining: number;
  reset: number; // Seconds to reset
}

const rateLimitState: RateLimitState = {
  remaining: Infinity,
  reset: 0,
};

export async function rateLimitedFetch(
  url: string,
  config: Record<string, any> = {}
): Promise<any> {
  if (rateLimitState.remaining === 0) {
    console.log(
      `Rate limit reached. Sleeping for ${rateLimitState.reset} seconds...`
    );
    await new Promise((resolve) =>
      setTimeout(resolve, rateLimitState.reset * 1000)
    );
  }

  const response = await axios(url, config);

  // Update rate limit state from response headers
  rateLimitState.remaining =
    parseInt(response.headers['x-ratelimit-remaining'], 10) || Infinity;
  rateLimitState.reset =
    parseInt(response.headers['x-ratelimit-reset'], 10) || 0;

  return response.data;
}
