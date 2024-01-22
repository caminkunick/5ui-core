import { IconButton, IconButtonProps, styled } from "@mui/material";
import { ReactNode } from "react";

export type ActionIconProps = IconButtonProps & { icon?: ReactNode };
export const ActionIcon = styled(({ icon, ...props }: ActionIconProps) => {
  return (
    <IconButton size="small" {...props}>
      {icon ?? props.children}
    </IconButton>
  );
})({
  "&.MuiIconButton-sizeSmall": {
    fontSize: "1rem",
    padding: 2,
  },
});