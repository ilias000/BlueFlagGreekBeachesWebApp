import React from "react";
import { Button } from "@mui/material";

interface PropsSignUp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignUp(props: PropsSignUp) {
  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // axios call to register api endpoint
    props.setOpen(false);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <p>Φόρμα εγγραφής</p>
      <Button variant="contained" color="primary" type="submit" sx={{ textTransform: "none ! important" }}>
        Εγγραφή
      </Button>
    </form>
  );
}
