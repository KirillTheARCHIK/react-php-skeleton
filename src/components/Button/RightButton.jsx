import { Stack } from "@mui/material";
import Button from "components/Button";

export default function RightButton({ isDisabled, label, onClick, ...props }) {
  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center">
      <Button
        disabled={isDisabled}
        variant="outlined"
        size="small"
        onClick={onClick}
        color="inherit"
        {...props}
      >
        {label}
      </Button>
    </Stack>
  );
}
