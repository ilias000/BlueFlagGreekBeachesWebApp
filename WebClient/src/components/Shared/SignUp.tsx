import React from "react";
import { Button } from "@mui/material";

const handleSignUp = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("sign up");
};

export default function SignUp() {
  return (
    <form onSubmit={handleSignUp}>
      <p>Φόρμα εγγραφής</p>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ textTransform: "none ! important" }}
      >
        Εγγραφή
      </Button>
    </form>
  );
}
