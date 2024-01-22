import { Box, BoxProps, IconButton } from "@mui/material";
import { MainContainerUi as Ui } from "./ui";
import { Core } from "../core";
import { useReducer } from "react";
import { SignIn } from "../signin";
import { Loading } from "../loading";
import { Menu } from "@mui/icons-material";

export type StateAction =
  | { type: "anchor"; value: HTMLElement | null }
  | { type: "open"; key: keyof State["open"]; value: boolean }
  | { type: "toggle"; key: keyof State["open"] };
export class State {
  open: Record<"sidebar", boolean> = {
    sidebar: false,
  };
  anchorEl: HTMLElement | null = null;

  constructor(data?: Partial<State>) {
    Object.assign(this, data);
  }

  Set<T extends keyof State>(key: T, value: State[T]): State {
    return new State({ ...this, [key]: value });
  }

  Open<T extends keyof State["open"]>(key: T, value: boolean): State {
    this.open[key] = value;
    return new State(this);
  }

  static reducer(s: State, a: StateAction): State {
    switch (a.type) {
      case "anchor":
        return s.Set("anchorEl", a.value);
      case "open":
        return s.Open(a.key, a.value);
      case "toggle":
        return s.Open(a.key, !s.open[a.key]);
      default:
        return s;
    }
  }
}

export type MainContainerProps = BoxProps & {
  loading?: boolean;
  signInOnly?: boolean;
  sidebar?: React.ReactNode;
};
export const MainContainer = ({
  loading,
  signInOnly,
  sidebar,
  ...props
}: MainContainerProps) => {
  const { state: coreState, mobile } = Core.useCore();
  const [state, dispatch] = useReducer(State.reducer, new State());

  if (loading) {
    return <Loading />;
  }

  if (signInOnly) {
    if (coreState.loading) {
      return <Loading />;
    } else if (coreState.loading === false && !coreState.user) {
      return <SignIn />;
    }
  }

  return (
    <Ui.Wrapper {...props}>
      {sidebar && (
        <Ui.Sidebar
          open={state.open.sidebar}
          onClose={() => dispatch({ type: "toggle", key: "sidebar" })}
        >
          {sidebar}
        </Ui.Sidebar>
      )}
      <Ui.Content>
        <Ui.Appbar>
          {Boolean(mobile && sidebar) && (
            <IconButton
              size="large"
              edge="start"
              onClick={() =>
                dispatch({
                  type: "toggle",
                  key: "sidebar",
                })
              }
            >
              <Menu fontSize="inherit" />
            </IconButton>
          )}
          <Box flex={1} />
          <Ui.UserIconButton
            loading={coreState.loading}
            user={coreState.user}
            onClick={(e) =>
              dispatch({ type: "anchor", value: e.currentTarget })
            }
          />
        </Ui.Appbar>
        {props.children}
      </Ui.Content>
      <Ui.UserMenu
        open={Boolean(state.anchorEl && coreState.user)}
        onClose={() => dispatch({ type: "anchor", value: null })}
        anchorEl={state.anchorEl}
        user={coreState.user}
      />
      <SignIn
        open={Boolean(state.anchorEl && !coreState.user)}
        onClose={() => dispatch({ type: "anchor", value: null })}
      />
    </Ui.Wrapper>
  );
};
