import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h2" align="center">
        Oops, page not found!
      </Typography>
      <Typography variant="h6" align="center">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </Typography>
      <Link component={RouterLink} to="/" sx={{ mt: 2 }}>
        Go back to home
      </Link>
    </Box>
  );
};

export default NotFoundPage;
