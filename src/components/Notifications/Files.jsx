import { Typography } from "@mui/material";
import File from "components/Notifications/File";
import openURL from "helpers/openURL";

export default function Files({ files, hideHandler }) {
  return (
    <>
      <Typography variant="body2" color="text.secondary" mb="0.5em">
        Завершено
      </Typography>
      {files.map((file, index) => {
        return (
          <File
            file={file}
            key={index}
            onDownload={() =>
              openURL(`/api/v1/catalogs/user_tasks/download/${file.id}`, {
                fileName: `${file.name} ${file.filename}`,
              })
            }
            onHide={() => hideHandler([file.id])}
          />
        );
      })}
    </>
  );
}
