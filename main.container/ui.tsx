import {
  AppBar,
  AppBarProps,
  Avatar,
  CircularProgress,
  IconButton,
  IconButtonProps,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuProps,
  Toolbar,
  styled,
} from "@mui/material";
import { User, signOut, updateProfile } from "firebase/auth";
import {
  AccountCircle,
  Edit,
  Login,
  Logout,
  Person,
} from "@mui/icons-material";
import { Core } from "../core";
import { UserControl } from "../ctrls/user";

export namespace MainContainerUi {
  // ANCHOR - Appbar
  export type AppbarProps = AppBarProps;
  export const Appbar = styled((props: AppbarProps) => (
    <AppBar {...props}>
      <Toolbar>{props.children}</Toolbar>
    </AppBar>
  ))<AppbarProps>(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxSizing: "border-box",
  }));
  Appbar.defaultProps = {
    position: "sticky",
    elevation: 0,
  };

  // ANCHOR - UserIconButton
  export type UserIconButtonProps = IconButtonProps & {
    loading?: boolean;
    user?: User | null;
  };
  export const UserIconButton = styled(
    ({ loading, user, ...props }: UserIconButtonProps) => {
      return (
        <IconButton
          size="large"
          edge="end"
          {...props}
          disabled={props.disabled || loading}
        >
          {loading ? (
            <CircularProgress size={32} color="inherit" />
          ) : user ? (
            user?.photoURL ? (
              <Avatar src={user?.photoURL} />
            ) : (
              <Person />
            )
          ) : (
            <Login />
          )}
        </IconButton>
      );
    }
  )<UserIconButtonProps>({});

  // ANCHOR - UserMenu
  export type UserMenuProps = MenuProps & {
    user?: User | null;
  };
  export const UserMenu = ({ user, ...props }: UserMenuProps) => {
    const { state, dispatch } = Core.useCore();

    const handleEdit = () =>
      dispatch({
        type: "popup",
        value: {
          title: "Display Name",
          text: "Display Name",
          value: user?.displayName ?? "",
          icon: <Person fontSize="inherit" />,
          type: "prompt",
          onConfirm: (value) => {
            if (value && state.user) {
              updateProfile(state.user, { displayName: value }).then(() =>
                location.reload()
              );
            }
          },
        },
      });
    const handleSignOut = () => {
      props.onClose?.(null, "backdropClick");
      state.Use().Auth((auth) => signOut(auth));
    }
    const handleChangeProfile = (files: FileList | null) => {
      if (files && files.length > 0 && state.user) {
        state.Use().storage((storage) => {
          UserControl.changeProfile(storage, state.user, files[0]).then(() =>
            location.reload()
          );
        });
      }
    };

    return (
      <Menu
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ disablePadding: true }}
        slotProps={{
          paper: { sx: (theme) => ({ minWidth: theme.mixins.sidebar.width }) },
        }}
        {...props}
      >
        <ListItem divider>
          <ListItemAvatar>
            <Avatar src={user?.photoURL ?? ""} />
          </ListItemAvatar>
          <ListItemText
            primary={
              user?.displayName ?? user?.email ?? user?.uid ?? "Anonymous"
            }
          />
        </ListItem>
        <label>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleChangeProfile(e.target.files)}
          />
          <ListItemButton divider>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Profile Image" />
          </ListItemButton>
        </label>
        <ListItemButton divider onClick={handleEdit}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Display Name" />
        </ListItemButton>
        <ListItemButton sx={{ color: "error.main" }} onClick={handleSignOut}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </Menu>
    );
  };
}
