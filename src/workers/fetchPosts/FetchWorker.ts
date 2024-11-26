import { fetchAndProcessPosts } from '../../services/posts';
import { getTopPosts, getTopUsers } from '../../services/stats';
import { log } from '../../utils/logger/Logger';

export const fetchWorker = async (
  subreddits: string[],
  token: string,
  userAgent: string,
  rateLimiter: () => Promise<void>,
  interval: number = 10000,
  limit: number = 5,
  setTopPosts: (posts: any[]) => void,
  setTopUsers: (users: any[]) => void
): Promise<NodeJS.Timeout> => {
  const loop = async (): Promise<void> => {
    try {
      // Fetch and process posts concurrently
      const posts = await fetchAndProcessPosts(
        subreddits,
        token,
        userAgent,
        rateLimiter
      );
      // Compute statistics
      const topPosts = getTopPosts(posts, limit);
      const topUsers = getTopUsers(posts, limit);

      // Use provided setter functions to update the state
      setTopPosts(topPosts);
      setTopUsers(topUsers);
      // Log the statistics
      log(`Top Posts: ${JSON.stringify(topPosts, null, 2)}`);
      log(`Top Users: ${JSON.stringify(topUsers, null, 2)}`);
    } catch (error) {
      log(`Error in fetchWorker: ${error}`);
    }
  };

  // Start the worker with the specified interval
  return setInterval(loop, interval);
};
