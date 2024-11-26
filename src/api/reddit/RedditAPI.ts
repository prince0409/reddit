import axios from 'axios';
import { RateLimiter } from '../../utils/rateLimiter';
const REDDIT_BASE_URL = 'https://oauth.reddit.com';

export const fetchAccessToken = async (
  clientId: string,
  clientSecret: string,
  userAgent: string
): Promise<string> => {
  const response = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    { grant_type: 'client_credentials' },
    {
      method: 'POST',
      auth: { username: clientId, password: clientSecret },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
};

export const fetchSubredditPosts = async (
  subreddit: string,
  token: string,
  userAgent: string,
  rateLimiter: ReturnType<typeof RateLimiter>
): Promise<any[]> => {
  await rateLimiter();
  const response = await axios.get(`${REDDIT_BASE_URL}/r/${subreddit}/top`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      limit: 10,
      t: 'all', // Time period for top posts
    },
  });

  return response.data.data.children.map((child: any) => child.data);
};
