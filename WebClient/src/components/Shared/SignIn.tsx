import React from "react";
import { Button } from "@mui/material";
import AuthContext from "./Auth";

interface PropsSignIn {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SingIn(props: PropsSignIn) {
  const { LoginUser } = React.useContext(AuthContext);

  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    LoginUser(e);
    props.setOpen(false);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p>Φόρμα σύνδεσης</p>
        <Button variant="contained" color="primary" type="submit" sx={{ textTransform: "none !important" }}>
          Σύνδεση
        </Button>
      </form>
    </>
  );
}
