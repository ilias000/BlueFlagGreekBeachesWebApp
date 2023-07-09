import React from "react";
import { BeatLoader } from "react-spinners";
import { AppBar, Toolbar } from "@mui/material";
import baseAxios from "../../AxiosConfig";

const AuthContext = React.createContext({
  AuthData: { email: "", role: "anonymous", isLoggedIn: false },
  LoginUser: (email: string, password: string) => {},
  LogoutUser: () => {},
});

export default AuthContext;

export function AuthProvider({ children }: any) {
  const [AuthData, setAuthData] = React.useState({
    email: "",
    role: "anonymous",
    isLoggedIn: false,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const LoginUser = React.useCallback((email: string, password: string) => {
    let role = "user";
    if (email === "admin") {
      role = "admin";
    }

    // axios call with form data
    baseAxios
      .post("user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        const token: string = response.data;
        localStorage.setItem("jwt", token.slice(7));
        setAuthData({
          email: email,
          role: role,
          isLoggedIn: true,
        });
      })
      .catch((error) => {
        console.log(error);
        alert("Λάθος στοιχεία");
      });
  }, []);

  const LogoutUser = React.useCallback(() => {
    localStorage.removeItem("jwt");
    setAuthData({
      email: "",
      role: "anonymous",
      isLoggedIn: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ AuthData, LoginUser: LoginUser, LogoutUser: LogoutUser }}>
      {isLoading ? (
        <>
          <AppBar position="fixed" sx={{ backgroundColor: "#1490b9" }}>
            <Toolbar></Toolbar>
          </AppBar>
          <BeatLoader size={20} color={"#123abc"} loading={isLoading} />
        </>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
