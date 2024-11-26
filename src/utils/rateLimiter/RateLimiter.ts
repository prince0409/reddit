export const RateLimiter = (
  maxRequests: number,
  resetTime: number
): (() => Promise<void>) => {
  let requests = 0;
  let lastReset = Date.now();

  return async () => {
    if (Date.now() - lastReset > resetTime) {
      requests = 0;
      lastReset = Date.now();
    }

    if (requests >= maxRequests) {
      await new Promise((resolve) => setTimeout(resolve, resetTime));
      requests = 0;
    }

    requests++;
  };
};
