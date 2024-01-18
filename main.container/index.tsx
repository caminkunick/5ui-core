import { Box, BoxProps } from "@mui/material";
import { MainContainerUi as Ui } from "./ui";
import { Core } from "../core";
import { useState } from "react";
import { SignIn } from "../signin";
import { Loading } from "../loading";

export type MainContainerProps = BoxProps & {
  loading?: boolean;
  signInOnly?: boolean;
};
export const MainContainer = ({ loading, signInOnly, ...props }: MainContainerProps) => {
  const { state } = Core.useCore();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  if(loading){
    return <Loading />
  }

  if(signInOnly){
    if(state.loading){
      return <Loading />
    } else if(state.loading === false && !state.user){
      return <SignIn />
    }
  }

  return (
    <Box {...props}>
      <Ui.Appbar>
        <Box flex={1} />
        <Ui.UserIconButton
          loading={state.loading}
          user={state.user}
          onClick={(e) => setAnchor(e.currentTarget)}
        />
      </Ui.Appbar>
      {props.children}
      <Ui.UserMenu
        open={Boolean(anchor && state.user)}
        onClose={() => setAnchor(null)}
        anchorEl={anchor}
        user={state.user}
      />
      <SignIn
        open={Boolean(anchor && !state.user)}
        onClose={() => setAnchor(null)}
      />
    </Box>
  );
};
