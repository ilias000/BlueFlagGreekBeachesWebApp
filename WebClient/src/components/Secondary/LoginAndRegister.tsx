import React from "react";
import { Modal, Box, Tabs, Tab, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "./Auth";

interface SignInUpProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SignIn(props: SignInUpProps) {
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

function SignUp(props: SignInUpProps) {
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

interface LoginAndRegisterProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginAndRegister(props: LoginAndRegisterProps) {
  const [tab, setTab] = React.useState(0);

  return (
    <>
      <Modal
        open={props.openModal}
        onClose={() => props.setOpenModal(false)}
        aria-labelledby="modal-signin-signup"
        aria-describedby="modal-signin-signup-desc"
        sx={{ display: "flex" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            maxWidth: "550px",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ justifyContent: "space-between" }}>
            <Tabs
              value={tab}
              onChange={(e, newtab) => setTab(newtab)}
              aria-label="basic tabs example"
              variant="fullWidth"
            >
              <Tab label="ΣΥΝΔΕΣΗ" />
              <Tab label="ΕΓΓΡΑΦΗ" />
            </Tabs>
          </Box>
          <Box>
            {tab === 0 && <SignIn setOpen={props.setOpenModal} />}
            {tab === 1 && <SignUp setOpen={props.setOpenModal} />}
          </Box>

          <Box sx={{ position: "absolute", top: "0.2rem", right: "0.2rem" }}>
            <Button onClick={() => props.setOpenModal(false)}>
              <CloseIcon></CloseIcon>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}