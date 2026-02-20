import { Box, Stack } from "@mui/material";
import Button from "components/Button";

export const renderTitleFiles = (isOpen, setIsOpen, onAdd) => {
  if (!isOpen && onAdd) {
    return (
      <Stack spacing={2} direction="row" alignItems="center">
        <Box component="span">Файлы</Box>

        <Button onClick={() => setIsOpen(true)} variant="contained">
          Добавить файл
        </Button>
      </Stack>
    );
  }
  return "Файлы";
};
