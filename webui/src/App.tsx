import './App.css';
import { ErrorBoundary } from './ErrorBoundary';
import { Routes } from './routes';

const App = () => {
  return (
    <ErrorBoundary fallback={<h2>Oops! Something went wrong.</h2>}>
      <Routes isAuthorized={false} />
    </ErrorBoundary>
  );
};

export default App;
