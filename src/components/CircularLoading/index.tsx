import { Box, CircularProgress } from "@mui/material";

const CircularLoading = ({ top = 50, left = 50, ...rest }: { top?: number; left?: number; [key: string]: any }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: `calc(${top}% - 12.5px)`,
        left: `calc(${left}% - 12.5px)`,
        zIndex: 999,
      }}
    >
      <CircularProgress {...rest} size={25} />
    </Box>
  );
};

export default CircularLoading;
