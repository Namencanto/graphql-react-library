import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  redirectPath: string;
  path: string;
  element: any;
}

export default function PrivateRoute({
  redirectPath,
  ...props
}: PrivateRouteProps) {
  const user = useSelector((state: any) => state.auth.user);
  console.log(user);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add any code here to check the user's authentication status
    // and set isLoading to false when done loading
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectPath} />;
  }

  return <Route {...props} />;
}
