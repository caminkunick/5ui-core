import { Alert, Box, Snackbar, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { AlertProps } from "@mui/material";
import { Core } from "../core";

export class AlertItemType {
  key: string = "";
  label: React.ReactNode = "";
  severity: AlertProps["severity"] = "info";

  constructor(data?: Partial<AlertItemType>) {
    Object.assign(this, data);
  }
}

const AlertIitem = ({ value }: { value: AlertItemType }) => {
  const { dispatch } = Core.useCore();

  useEffect(() => {
    setTimeout(() => {
      if (value) {
        dispatch({ type: "alert/remove", value: value.key });
      }
    }, 5000);
  }, [dispatch, value]);

  return (
    <Alert
      variant="filled"
      severity={value.severity}
      onClose={() => dispatch({ type: "alert/remove", value: value.key })}
    >
      {value.label}
    </Alert>
  );
};

export const AlertsContainer = () => {
  const { state } = Core.useCore();

  return (
    <Snackbar
      open={Boolean(state.alerts.length)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Box>
        <Stack spacing={1}>
          {state.alerts.map((item) => (
            <AlertIitem value={item} key={item.key} />
          ))}
        </Stack>
      </Box>
    </Snackbar>
  );
};
