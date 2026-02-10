import { BrowserRouter } from 'react-router';
import './App.css';
import { ErrorBoundary } from './ErrorBoundary';
import { AppRoutes } from './routes';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
