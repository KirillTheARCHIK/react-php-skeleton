import React from "react";
import { useHistory } from "react-router-dom";
import { Alert, Snackbar, type AlertColor, type AlertProps } from "@mui/material";

interface WithAlertParams {
  customSxAlert?: AlertProps["sx"];
  customRenderMessage?: (message?: string) => React.ReactNode;
}

const withAlert = (WrappedComponent: React.FC<{ onOpenAlert: (severity: AlertColor, message: string | undefined) => void }>) => {
  return ({ customSxAlert = {}, customRenderMessage, ...props }: WithAlertParams) => {
    const history = useHistory();

    const [open, setOpen] = React.useState(false);
    const [severity, setSeverity] = React.useState<AlertColor>("success");
    const [message, setMessage] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
      setOpen(false);
    }, [history.location.pathname]);

    const onOpenAlert = (severity: AlertColor, message: string | undefined) => {
      setOpen(true);
      setSeverity(severity);

      setMessage(message);
    };

    const onClose = () => {
      setOpen(false);
    };

    return (
      <>
        <WrappedComponent onOpenAlert={onOpenAlert} {...props} />
        <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={5000} onClose={onClose}>
          <Alert
            onClose={onClose}
            severity={severity}
            sx={{
              width: "100%",
              maxWidth: "300px",
              maxHeight: "400px",
              alignItems: "flex-end",
              ...customSxAlert,
            }}
          >
            {customRenderMessage ? customRenderMessage(message) : message}
          </Alert>
        </Snackbar>
      </>
    );
  };
};

export default withAlert;
