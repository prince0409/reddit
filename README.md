# Reddit Programming Assignment

This repository contains a program that fetches posts from subreddits in real-time, tracks the top posts by upvotes, and identifies users with the most posts. It is built to handle concurrency, rate limits, and is structured following SOLID principles for scalability and maintainability.

---

## 🚀 How to Start

### Prerequisites

1. **Node.js** (16+)
2. **npm** or **yarn**
3. A **Reddit API Access Token**.  
   Follow these steps to generate it:
   - Go to the [Reddit App Developer Page](https://www.reddit.com/prefs/apps).
   - Create an application and note the `Client ID` and `Client Secret`.
   - Use the `client_credentials` flow to get an OAuth token. Example using `curl`:
     ```bash
     curl -X POST -d "grant_type=client_credentials" -u "<client_id>:<client_secret>" https://www.reddit.com/api/v1/access_token
     ```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/reddit-post-user-aggregator.git
   cd reddit-post-user-aggregator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure it with your Reddit API credentials:
   ```env
   CLIENT_ID=<your-client-id>
   CLIENT_SECRET=<your-client-secret>
   USER_AGENT=<your-user-agent>
   ```

4. Run the program:
   ```bash
   npm start
   ```

---

## 📋 What It Does

This program:
- Fetches posts from multiple subreddits in **real-time**.
- Tracks:
  - **Top posts** based on upvotes.
  - **Users with the most posts** (by aggregating posts from subreddits).
- Handles:
  - **Concurrency**: Fetches from multiple subreddits simultaneously.
  - **Rate limits**: Complies with Reddit API’s rate-limiting policies.
- Provides a scalable, modular, and production-ready structure using **SOLID principles**.

---

## 🗂️ Folder Structure

```plaintext
src/
├── api/                          # Handles API interactions
│   ├── reddit/                   # Reddit API-specific functions
│   │   ├── RedditAPI.ts
│   │   ├── index.ts
├── config/                       # Application configuration
│   ├── index.ts
├── models/                       # Data models
│   ├── post/                     # Post-specific models
│   │   ├── Post.ts
│   │   ├── index.ts
│   ├── user/                     # User-specific models
│   │   ├── User.ts
│   │   ├── index.ts
├── services/                     # Core business logic
│   ├── posts/                    # Post-specific services
│   │   ├── PostService.ts
│   │   ├── index.ts
│   ├── users/                    # User-specific services
│   │   ├── TopUsersService.ts
│   │   ├── index.ts
├── utils/                        # Utility functions
│   ├── logger/                   # Logging utilities
│   │   ├── Logger.ts
│   │   ├── index.ts
│   ├── rateLimiter/              # Rate limiter utilities
│   │   ├── RateLimiter.ts
│   │   ├── index.ts
├── workers/                      # Background workers
│   ├── fetchPosts/               # Fetch posts worker
│   │   ├── FetchWorker.ts
│   │   ├── index.ts
├── tests/                        # Unit and integration tests
│   ├── api/                      # Tests for API functions
│   ├── services/                 # Tests for services
│   ├── utils/                    # Tests for utilities
├── app.ts                        # Entry point
├── server.ts                     # REST API server
```

---

## 🛠️ Reddit APIs Used

1. **Fetch posts from a subreddit**:
   - Endpoint: `GET /r/{subreddit}/new`
   - Used to fetch all posts from a subreddit for aggregation.

2. **Fetch top posts**:
   - Endpoint: `GET /r/{subreddit}/top`
   - Used to fetch the top posts from a subreddit within a specific time period.

3. **Fetch subreddits**:
   - Endpoint: `GET /subreddits/{where}`
   - Fetches subreddits based on different criteria (`popular`, `new`, etc.).

---

## ⚙️ How It Works

### 1. **Real-Time Fetching**
- Subreddits are fetched in **parallel** using `Promise.allSettled` for concurrency.
- The application uses **background workers** to periodically fetch and process new posts.

### 2. **Rate Limiting**
- Reddit API rate limits are respected using a **Rate Limiter Utility**.
- The limiter ensures API requests stay within the allowed limits (e.g., 60 requests/minute).

### 3. **Concurrency**
- Multiple subreddit fetches are handled concurrently.
- Partial failures (e.g., one subreddit fetch fails) do not block the entire process.

---

## 🏗️ SOLID Principles

1. **Single Responsibility**:
   - Each module (e.g., `PostService`, `TopUsersService`) handles a specific task.
   - Utilities like `RateLimiter` and `Logger` are decoupled from business logic.

2. **Open/Closed Principle**:
   - The system is open for extension (e.g., adding new APIs) but closed for modification of existing logic.

3. **Liskov Substitution**:
   - All services and utilities follow strict contracts, ensuring seamless substitution.

4. **Interface Segregation**:
   - Small, focused interfaces ensure only necessary dependencies are used.

5. **Dependency Inversion**:
   - High-level modules depend on abstractions (e.g., `fetchSubredditPosts`), not concrete implementations.

---

## 🔮 What More Can Be Done

1. **Persist Data**:
   - Store fetched data (posts, users) in a database (e.g., PostgreSQL, MongoDB).
   - Allow historical analysis of top posts/users.

2. **Get Top Users with Reddit API (if available)**:
   - Directly use Reddit APIs to fetch users' statistics if Reddit provides it.

3. **Batch API Calls for Aggregation**:
   - If Reddit doesn't provide user-level statistics, batch fetches can be performed, aggregating posts by `author`. Here's a conceptual snippet:
     ```typescript
     const aggregateUsers = (posts: Post[]): Record<string, number> => {
         return posts.reduce((acc, post) => {
             acc[post.author] = (acc[post.author] || 0) + 1;
             return acc;
         }, {});
     };

     const topUsers = Object.entries(aggregateUsers(posts))
         .map(([author, count]) => ({ author, count }))
         .sort((a, b) => b.count - a.count)
         .slice(0, 10);
     ```

4. **Scalability Improvements**:
   - Use a message queue (e.g., RabbitMQ, Kafka) for distributing fetch and processing tasks.
   - Deploy as a microservice with load balancing for handling multiple subreddits efficiently.

5. **Production Readiness**:
   - Add logging with monitoring tools like Prometheus or Datadog.
   - Implement error recovery mechanisms for failed API requests.

---
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
