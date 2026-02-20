import { Typography } from "@mui/material";
import FileInProgress from "components/Notifications/FileInProgress";

export default function FilesInProgress({ files }) {
  const text = files.length === 0 ? "В процессе (отсутствуют)" : "В процессе";
  return (
    <>
      <Typography variant="body2" color="text.secondary" mb="1.5em">
        {text}
      </Typography>
      {files.map((file, index) => (
        <FileInProgress file={file} key={index} />
      ))}
    </>
  );
}
