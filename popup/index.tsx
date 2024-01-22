import { ReactNode, useEffect, useState } from "react";
import { Core } from "../core";
import {
  Box,
  Button,
  Dialog,
  Slide,
  SlideProps,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Delete, InfoRounded } from "@mui/icons-material";

const OutlineButton = styled(Button)({});
OutlineButton.defaultProps = {
  variant: "outlined",
  size: "large",
  fullWidth: true,
  disableElevation: true,
};

export class PopupValue {
  title: ReactNode = "";
  text: ReactNode = "";
  icon: ReactNode = "";
  value: string = "";
  onConfirm: (value: string) => void = () => {};
  onAbort: () => void = () => {};
  type: "alert" | "confirm" | "prompt" | "remove" = "alert";

  constructor(init?: Partial<PopupValue>) {
    Object.assign(this, init);
  }

  change(value: string): PopupValue {
    return new PopupValue({ ...this, value });
  }

  static Remove(item: string, onConfirm: () => void): PopupValue {
    return new PopupValue({
      title: "Remove",
      text: `Are you sure you want to remove "${item}"?`,
      icon: <Delete fontSize="inherit" />,
      onConfirm: () => onConfirm(),
      type: "remove",
    });
  }
}

export const PopupContainer = styled((props: { className?: string }) => {
  const { state, dispatch } = Core.useCore();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (state.popup) {
      setOpen(true);
      setValue(state.popup.value);
    }
  }, [state.popup]);

  const handleConfirm = () => {
    state.popup?.onConfirm(value);
    setOpen(false);
    setValue("");
  };
  const handleClose = () => {
    state.popup?.onAbort();
    setOpen(false);
    setValue("");
  };

  return (
    <Dialog
      className={props.className}
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      TransitionComponent={Slide}
      TransitionProps={
        {
          direction: "down",
          onExited: () => {
            dispatch({ type: "popup", value: null });
          },
        } as any
      }
    >
      <Box className="container">
        {state.popup?.icon && <Box className="icon">{state.popup?.icon}</Box>}
        <Typography
          variant="h5"
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="center"
        >
          {state.popup?.title}
        </Typography>
        {state.popup?.type === "prompt" ? (
          <TextField
            fullWidth
            label={state.popup?.text}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <Typography variant="caption" textAlign="center" color="textSecondary">
            {state.popup?.text}
          </Typography>
        )}
        {((type?: PopupValue["type"]) => {
          switch (type) {
            case "alert":
              return <OutlineButton onClick={handleClose}>OK</OutlineButton>;
            case "confirm":
            case "prompt":
              return (
                <Stack spacing={1}>
                  <OutlineButton onClick={handleConfirm}>Confirm</OutlineButton>
                  <OutlineButton color="neutral" onClick={handleClose}>
                    Cancel
                  </OutlineButton>
                </Stack>
              );
            case "remove":
              return (
                <Stack spacing={1}>
                  <OutlineButton color="error" onClick={handleConfirm}>
                    Remove
                  </OutlineButton>
                  <OutlineButton color="neutral" onClick={handleClose}>
                    Cancel
                  </OutlineButton>
                </Stack>
              );
            default:
              return null;
          }
        })(state.popup?.type)}
      </Box>
    </Dialog>
  );
})(({ theme }) => ({
  ".MuiPaper-root": {
    borderRadius: theme.spacing(3),
    maxWidth: theme.spacing(40),
  },
  ".container": {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  ".icon": {
    display: "flex",
    justifyContent: "center",
    fontSize: theme.spacing(6),
    lineHeight: 1,
  },
}));
