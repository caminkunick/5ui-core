import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";

export interface PassFieldProps {
  label?: React.ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  helperText?: React.ReactNode;
  error?: boolean;
}
export const PassField = (props: PassFieldProps) => {
  const [show, setShow] = useState<boolean>(false);

  const handleToggleShow = () => setShow((s) => !s);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl fullWidth variant="outlined" error={props.error}>
      <InputLabel htmlFor="outlined-adornment-password">
        {props.label}
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={show && !props.disabled ? "text" : "password"}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleToggleShow}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
              disabled={props.disabled}
            >
              {show ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        label={props.label}
      />
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
};
