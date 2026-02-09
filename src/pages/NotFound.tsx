import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4 safe-area">
      <div className="text-center max-w-md w-full">
        <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold">404</h1>
        <p className="mb-4 text-base sm:text-xl text-foreground/70">Oops! Page not found</p>
        <a href="/" className="inline-block text-primary underline hover:opacity-80 min-h-[44px] leading-[44px] touch-manipulation">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
