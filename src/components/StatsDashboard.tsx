import React, { useEffect, useState } from 'react';
import { config } from '../config';
import { fetchAccessToken } from '../api/reddit';
import { RateLimiter } from '../utils/rateLimiter';
import { fetchWorker } from '../workers/fetchPosts';

import StatsTable from './StatsTable';
import Spinner from './Spinner';

const subreddits = ['gifs'];
const interval = 10000;
const topLimit = 5;

const StatsDashboard: React.FC = () => {
  const [_, setToken] = useState<string | null>(null);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rateLimiter = RateLimiter(
      config.rateLimit.maxRequests,
      config.rateLimit.resetTime
    );

    const initializeWorker = async () => {
      try {
        // Fetch Reddit API token
        const fetchedToken = await fetchAccessToken(
          process.env.REACT_APP_CLIENT_ID || '',
          process.env.REACT_APP_CLIENT_SECRET || '',
          config.userAgent
        );
        setToken(fetchedToken);

        // Start the fetch worker
        const worker = await fetchWorker(
          subreddits,
          fetchedToken,
          config.userAgent,
          rateLimiter,
          interval,
          topLimit,
          setTopPosts,
          setTopUsers
        );

        // Clean up worker on component unmount
        return () => clearInterval(worker);
      } catch (err: any) {
        setError(err.message);
      }
    };

    // Start the worker
    const cleanup = initializeWorker();

    return () => {
      if (cleanup instanceof Function) cleanup();
    };
  }, [subreddits, interval, topLimit]);

  // // Example: Displaying statistics
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     // Periodically update statistics state (e.g., via API or logs)
  //     // Mocked here as no real implementation of stats update is connected to UI.
  //   };

  //   const statsInterval = setInterval(fetchStats, interval);

  //   return () => clearInterval(statsInterval);
  // }, [interval]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-center">
      <h1 className="text-2xl">Subreddits Monitoring</h1>
      <p className="text-xl">Monitoring: {subreddits.join(', ')}</p>
      {!(topPosts && topPosts.length) ? (
        <Spinner />
      ) : (
        <>
          <h2 className="text-xl">Top Posts</h2>
          <StatsTable
            rows={topPosts.map((post) => ({ ...post, count: post.ups }))}
          />
          <h2 className="text-xl mt-4">Top Users</h2>
          <StatsTable
            rows={topUsers.map((user) => ({
              id: user.user,
              title: user.user,
              count: user.postCount,
            }))}
          />
        </>
      )}
    </div>
  );
};

export default StatsDashboard;
