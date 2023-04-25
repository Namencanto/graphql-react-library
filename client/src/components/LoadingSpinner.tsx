import { CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress size={80} sx={{ color: "#4b5563" }} />
    </div>
  );
};

export default LoadingSpinner;
