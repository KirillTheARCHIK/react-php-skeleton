import Button from "components/Button";
import { useRef } from "react";
import { Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function InputFile({
  variant = "contained",
  label = "Выбрать файл",
  name = "file",
  size = "small",
  input,
  meta: { error, submitError } = {
    error: "",
  },
  sx,
  ...props
}) {
  const inputRef = useRef(null);
  const newLabel = inputRef.current?.files[0]?.name || label;
  const defaultWidth = sx?.width || "150px";
  return (
    <Box sx={{ mb: "25px", width: defaultWidth, ...sx }}>
      <Button
        variant={variant}
        component="label"
        color={error ? "error" : "primary"}
        sx={{
          position: "relative",
          width: defaultWidth,
        }}
        size={size}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          name={name}
          onChange={input.onChange}
        />
        <Box
          component="div"
          sx={{
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            padding: "4px 10px",
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "100%",
          }}
        >
          <UploadFileIcon sx={{ marginRight: "10px", fontSize: "20px" }} />
          <Box
            component="div"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {newLabel}
          </Box>
        </Box>
      </Button>
      {(error || submitError) && (
        <p
          style={{
            color: "#EF4444",
            fontFamily: "'Helvetica','Roboto','Arial','sans-serif'",
            fontWeight: "400",
            fontSize: "0.75rem",
            lineHeight: "1.66",
            textAlign: "left",
            margin: "4px 14px 0 14px",
          }}
        >
          {error || submitError}
        </p>
      )}
    </Box>
  );
}
