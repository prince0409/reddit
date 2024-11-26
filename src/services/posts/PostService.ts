import { fetchSubredditPosts } from '../../api/reddit/RedditAPI';
import { RateLimiter } from '../../utils/rateLimiter/RateLimiter';
import { Post } from '../../models/post/Post';

export const fetchAndProcessPosts = async (
  subreddits: string[],
  token: string,
  userAgent: string,
  rateLimiter: ReturnType<typeof RateLimiter>
): Promise<Post[]> => {
  const fetchTasks = subreddits.map((subreddit) =>
    fetchSubredditPosts(subreddit, token, userAgent, rateLimiter)
  );

  const results = await Promise.allSettled(fetchTasks);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<Post[]> =>
        result.status === 'fulfilled'
    )
    .flatMap((result) => result.value);
};
