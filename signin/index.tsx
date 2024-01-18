import {
  styled,
  IconButton,
  Box,
  Backdrop,
  Slide,
  Dialog,
  DialogContent,
  SlideProps,
} from "@mui/material";
import { useState } from "react";
import { EmailPass } from "./email.pass";
import { ForgetPassword } from "./forget.pass";
import { Register } from "./register";
import { Close } from "@mui/icons-material";

const Root = styled(Box)<{ noBG?: boolean }>(({ theme, noBG }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: noBG ? `rgba(0,0,0,0.75)` : theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const Container = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.background.paper,
  width: "calc(100% - 36px)",
  maxWidth: parseInt(`${theme.mixins.sidebar.width}`) * 1.5,
  overflow: "auto",
}));

const CloseButtom = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

export const SignIn = ({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) => {
  const [tab, setTab] = useState<string>("emailpass");
  const handleChangeTab = (tab: string) => () => setTab(tab);

  if (onClose) {
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={Boolean(open)}
        onClose={onClose}
        TransitionComponent={Slide}
        TransitionProps={
          {
            direction: "down",
          } as SlideProps
        }
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
          }
        }}
      >
        <DialogContent>
          <EmailPass tab={tab} onChangeTab={handleChangeTab} />
          <Register tab={tab} onChangeTab={handleChangeTab} />
          <ForgetPassword tab={tab} onChangeTab={handleChangeTab} />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Root>
        <Container>
          <EmailPass tab={tab} onChangeTab={handleChangeTab} />
          <Register tab={tab} onChangeTab={handleChangeTab} />
          <ForgetPassword tab={tab} onChangeTab={handleChangeTab} />
        </Container>
      </Root>
    );
  }
};
