import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-muted-foreground text-9xl font-bold">404</h1>
        <h2 className="text-foreground mt-4 text-2xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-6 mt-2 max-w-md">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
