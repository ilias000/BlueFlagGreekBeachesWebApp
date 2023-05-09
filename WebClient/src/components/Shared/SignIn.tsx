import React from "react";
import { Button } from "@mui/material";

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("sign in");
};

export default function SingIn() {
  return (
    <>
      <form onSubmit={handleLogin}>
        <p>Φόρμα σύνδεσης</p>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ textTransform: "none ! important" }}
        >
          Σύνδεση
        </Button>
      </form>
    </>
  );
}
