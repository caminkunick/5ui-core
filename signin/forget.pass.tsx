import { Box, Button, Slide, TextField } from "@mui/material";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Core } from "../core";
import { ChevronLeft, Send } from "@mui/icons-material";

export const ForgetPassword = ({
  tab,
  onChangeTab,
}: {
  tab: string;
  onChangeTab: (tab: string) => () => void;
}) => {
  const { state, dispatch } = Core.useCore();
  const [email, setEMail] = useState<string>("");

  const handleSendEmail = () => {
    if (state?.auth) {
      sendPasswordResetEmail(state.auth, email)
        .then(() => {
          dispatch({
            type: "alert/add",
            value: { label: `Send Reset Password ${email}` },
          });
          onChangeTab("emailpass")();
        })
        .catch((err) =>
          dispatch({
            type: "alert/add",
            value: { label: err.message, severity: "error" },
          })
        );
    }
  };

  return (
    <Slide in={tab === "forget"} direction="down" unmountOnExit>
      <div style={{ width: "100%" }}>
        <Box mb={2}>
          <Button
            onClick={onChangeTab("emailpass")}
            size="small"
            startIcon={<ChevronLeft />}
          >
            Sign In
          </Button>
        </Box>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setEMail(value);
          }}
          error={!state.Validate().email(email)}
          helperText={!state.Validate().email(email) && "Invalid Email"}
        />
        <Button
          variant="outlined"
          size="large"
          fullWidth
          sx={{ mt: 1 }}
          startIcon={<Send />}
          disabled={!state.Validate().email(email)}
          onClick={handleSendEmail}
        >
          Send Email
        </Button>
      </div>
    </Slide>
  );
};
