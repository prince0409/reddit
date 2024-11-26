import { Post } from '../../models/post/Post';

export const getTopPosts = (posts: Post[], limit: number = 10): Post[] =>
  [...posts]
    .sort((a, b) => b.ups - a.ups)
    .map((post) => ({
      id: post.id,
      title: post.title,
      ups: post.ups,
      author: post.author,
    }))
    .slice(0, limit);

export const getTopUsers = (
  posts: Post[],
  limit: number = 10
): { user: string; postCount: number }[] =>
  Object.entries(
    posts.reduce(
      (acc, post) => {
        acc[post.author] = (acc[post.author] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  )
    .map(([user, postCount]) => ({ user, postCount }))
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, limit);
