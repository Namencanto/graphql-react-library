import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  redirectPath: string;
}

export default function PrivateRoute({
  redirectPath,
  ...props
}: PrivateRouteProps) {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  console.log(isAuthenticated);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add any code here to check the user's authentication status
    // and set isLoading to false when done loading
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  return <Route {...props} />;
}
