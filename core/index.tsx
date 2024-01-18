import {
  CssBaseline,
  ThemeOptions,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Auth, User, getAuth, onAuthStateChanged } from "firebase/auth";
import {
  HTMLAttributes,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { AlertItemType } from "../alerts";
import { PopupContainer, PopupValue } from "../popup";
import { grey } from "@mui/material/colors";
import { FirebaseStorage, getStorage } from "firebase/storage";

declare module "@mui/material/styles/createMixins" {
  interface Mixins {
    sidebar: CSSProperties;
    absoluteFluid: CSSProperties;
    flexCenter: CSSProperties;
  }
}

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

// SECTION - Core
export namespace Core {
  export const defaultTheme = (dark?: boolean): ThemeOptions => ({
    palette: {
      primary: {
        main: "#4285f4", // google blue
      },
      secondary: {
        main: grey[600],
      },
      warning: {
        main: "#fbbc05",
      },
      error: {
        main: "#db4437",
      },
      success: {
        main: "#34a853",
      },
      info: {
        main: "#4285f4",
      },
      mode: dark ? "dark" : "light",
      neutral: {
        main: grey[500],
      },
    },
    mixins: {
      sidebar: {
        width: 272,
      },
      absoluteFluid: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
      flexCenter: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    components: {
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: "inherit",
            minWidth: 36,
          },
        },
      },
    },
  });

  // ANCHOR - Darkmode
  export const watchDarkmode = (callback: (isDarkmode: boolean) => void) => {
    const elem = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => callback(e.matches);
    elem.addEventListener("change", listener);
    callback(elem.matches);
    return () => elem.removeEventListener("change", listener);
  };

  // ANCHOR - State
  export type StateAction =
    | { type: "dark"; value: boolean }
    | { type: "user"; value: User | null }
    | { type: "app"; value: FirebaseApp }
    | { type: "alert/add"; value: Partial<AlertItemType> }
    | { type: "alert/remove"; value: string }
    | { type: "popup"; value: Partial<PopupValue> | null };
  export class State {
    dark: boolean = false;
    loading: boolean = true;
    user: User | null = null;
    app: FirebaseApp | null = null;
    auth: Auth | null = null;
    db: Firestore | null = null;
    alerts: AlertItemType[] = [];
    popup: PopupValue | null = null;

    constructor(data?: Partial<State>) {
      Object.assign(this, data);
    }

    Set<T extends keyof State>(key: T, value: State[T]): State {
      return new State({ ...this, [key]: value });
    }

    Alert() {
      return {
        add: (newItem: Partial<AlertItemType>) => {
          this.alerts.push(new AlertItemType(newItem));
          return new State(this);
        },
        remove: (key: string) => {
          this.alerts = this.alerts.filter((item) => item.key !== key);
          return new State(this);
        },
      };
    }

    Validate() {
      return {
        email: (email: string): boolean => {
          const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
        },
      };
    }

    Use() {
      return {
        Auth: (callback: (auth: Auth) => void) => {
          if (this.auth) callback(this.auth);
        },
        DB: (callback: (db: Firestore) => void) => {
          if (this.db) callback(this.db);
        },
        storage: (callback: (storage: FirebaseStorage) => void) => {
          if (this.app) callback(getStorage(this.app));
        },
      };
    }

    static reducer(s: State, a: StateAction): State {
      switch (a.type) {
        case "dark":
          return s.Set("dark", a.value);
        case "user":
          return s.Set("user", a.value).Set("loading", false);
        case "app":
          return s
            .Set("app", a.value)
            .Set("auth", getAuth(a.value))
            .Set("db", getFirestore(a.value));
        case "alert/add":
          return s.Alert().add(a.value);
        case "alert/remove":
          return s.Alert().remove(a.value);
        case "popup":
          return s.Set("popup", a.value ? new PopupValue(a.value) : null);
        default:
          return s;
      }
    }
  }

  // ANCHOR - Context
  export const Context = createContext<{
    state: State;
    dispatch: React.Dispatch<StateAction>;
  }>({
    state: new State(),
    dispatch: () => {},
  });

  // ANCHOR - Hooks
  export const useCore = () => useContext(Context);

  // ANCHOR - Provider
  export type ProviderProps = HTMLAttributes<HTMLDivElement> &
    Partial<Pick<State, "app">>;
  export const Provider = ({ app, ...props }: ProviderProps) => {
    const [state, dispatch] = useReducer(State.reducer, new State());

    useEffect(() => {
      const unwatchDarkmode = watchDarkmode((value) =>
        dispatch({ type: "dark", value })
      );
      return () => unwatchDarkmode();
    }, []);

    useEffect(() => {
      if (app) {
        dispatch({ type: "app", value: app });
        const auth = getAuth(app);
        return onAuthStateChanged(auth, (user) =>
          dispatch({ type: "user", value: user })
        );
      }
    }, [app]);

    return (
      <Context.Provider value={{ state, dispatch }}>
        <ThemeProvider theme={createTheme(defaultTheme(state.dark))}>
          <CssBaseline />
          <div {...props} />
          <PopupContainer />
        </ThemeProvider>
      </Context.Provider>
    );
  };
}
// !SECTION
