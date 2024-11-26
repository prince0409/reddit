import { fetchAndProcessPosts } from '../PostService';
import { RateLimiter } from '../../../utils/rateLimiter/RateLimiter';
import { fetchSubredditPosts } from '../../../api/reddit';

jest.mock('../../../api/reddit/RedditAPI');

describe('fetchAndProcessPosts', () => {
  const mockToken = 'mock_token';
  const mockUserAgent = 'mock_user_agent';
  const mockRateLimiter = RateLimiter(60, 60000); // Example rate limiter
  const mockSubreddits = ['javascript', 'webdev'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and process posts from multiple subreddits successfully', async () => {
    // Mock responses for each subreddit
    (fetchSubredditPosts as jest.Mock)
      .mockResolvedValueOnce([
        { id: '1', title: 'Post 1', upvotes: 100, author: 'user1' },
        { id: '2', title: 'Post 2', upvotes: 200, author: 'user2' },
      ])
      .mockResolvedValueOnce([
        { id: '3', title: 'Post 3', upvotes: 300, author: 'user3' },
      ]);

    const result = await fetchAndProcessPosts(
      mockSubreddits,
      mockToken,
      mockUserAgent,
      mockRateLimiter
    );

    expect(fetchSubredditPosts).toHaveBeenCalledTimes(2);
    expect(fetchSubredditPosts).toHaveBeenCalledWith(
      'javascript',
      mockToken,
      mockUserAgent,
      mockRateLimiter
    );
    expect(fetchSubredditPosts).toHaveBeenCalledWith(
      'webdev',
      mockToken,
      mockUserAgent,
      mockRateLimiter
    );
    expect(result).toEqual([
      { id: '1', title: 'Post 1', upvotes: 100, author: 'user1' },
      { id: '2', title: 'Post 2', upvotes: 200, author: 'user2' },
      { id: '3', title: 'Post 3', upvotes: 300, author: 'user3' },
    ]);
  });

  it('should handle partial failures and return only successful results', async () => {
    // Mock one successful response and one failure
    (fetchSubredditPosts as jest.Mock)
      .mockResolvedValueOnce([
        { id: '1', title: 'Post 1', upvotes: 100, author: 'user1' },
      ])
      .mockRejectedValueOnce(new Error('Failed to fetch subreddit'));

    const result = await fetchAndProcessPosts(
      mockSubreddits,
      mockToken,
      mockUserAgent,
      mockRateLimiter
    );

    expect(fetchSubredditPosts).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { id: '1', title: 'Post 1', upvotes: 100, author: 'user1' },
    ]);
  });

  it('should return an empty array if all fetches fail', async () => {
    // Mock all fetches failing
    (fetchSubredditPosts as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed to fetch subreddit'))
      .mockRejectedValueOnce(new Error('Failed to fetch subreddit'));

    const result = await fetchAndProcessPosts(
      mockSubreddits,
      mockToken,
      mockUserAgent,
      mockRateLimiter
    );

    expect(fetchSubredditPosts).toHaveBeenCalledTimes(2);
    expect(result).toEqual([]);
  });

  it('should return an empty array if no subreddits are provided', async () => {
    const result = await fetchAndProcessPosts(
      [],
      mockToken,
      mockUserAgent,
      mockRateLimiter
    );

    expect(fetchSubredditPosts).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
