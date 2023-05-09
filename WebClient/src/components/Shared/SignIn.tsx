import React from "react";
import { Button } from "@mui/material";
import AuthContext from "./Auth";

export default function SingIn() {
  const { LoginUser } = React.useContext(AuthContext);

  return (
    <>
      <form onSubmit={LoginUser}>
        <p>Φόρμα σύνδεσης</p>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ textTransform: "none !important" }}
        >
          Σύνδεση
        </Button>
      </form>
    </>
  );
}
