# Reddit Programming Assignment

## Overview

Reddit, like many social media platforms, allows users to share and engage with content based on their interests. For this assignment, the task is to build an application that interacts with Reddit’s API to listen to a chosen subreddit and track various statistics.

The assignment will help assess your ability to work with APIs, handle concurrency, and structure your application for scalability, while adhering to SOLID principles.

## Requirements

### Core Functionality

Your app should:

1. **Consume Posts**: Continuously fetch posts from your chosen subreddit in near real-time.
2. **Track Statistics**: Keep track of the following statistics:

- Posts with the most upvotes.
- Users with the most posts.

3. **Periodic Reporting**: Provide a way to periodically report the values (e.g., log to the terminal, expose a RESTful API, etc.).

### Optional Enhancements

If you’d like to enhance the application further, you may track other interesting statistics. Additionally, think about how you might persist data if the app were to be scaled to a production environment (e.g., database storage).

### Real-time Data Fetching

- **Reddit’s API Rate Limiting**: Reddit implements rate limiting, which means the app must manage requests to avoid hitting the limit. The response headers provide details about rate limits, including:
  - Rate limit used
  - Rate limit remaining
  - Rate limit reset period
- Your app should handle rate limiting effectively and fetch data at a consistent rate.

### Concurrency

- The app should handle multiple requests concurrently to take advantage of available computing resources.
- The app should process posts efficiently, even if the subreddit has a high volume of posts.

### Scalability

Although the initial task is focused on a single subreddit, you should consider how the app could scale to handle multiple subreddits.

### SOLID Principles

While designing and developing the application, ensure the following:

- **SOLID Principles**: The code should follow SOLID principles to ensure maintainability and scalability.
- **Error Handling**: Proper error handling should be in place.
- **Unit Testing**: The application should include unit tests to ensure correctness.

## Technical Stack

- React
- Typescript
- TailwindCSS
- Jest

## Accessing the Reddit API

To get started, you will need to register for an API key on Reddit.

- [Reddit API Documentation](https://www.reddit.com/wiki/api/)
- Register for the Reddit API [here](https://www.reddit.com/wiki/api/).
