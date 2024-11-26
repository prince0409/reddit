import { QueryClientProvider, QueryClient } from 'react-query';
import RedditApp from './components/StatsDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RedditApp />
    </QueryClientProvider>
  );
}

export default App;
