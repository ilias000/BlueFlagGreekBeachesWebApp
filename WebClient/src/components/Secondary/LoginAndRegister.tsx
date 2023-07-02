import React from "react";
import { Modal, Box, Tabs, Tab, Button, Grid, Typography, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "./Auth";

interface SignInUpProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const validateEmail = (email: string): boolean => {
  // Email regex pattern for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { name, value } = e.target;
  setFormData((prevFormData: any) => ({
    ...prevFormData,
    [name]: value,
  }));
};

function SignIn(props: SignInUpProps) {
  const { LoginUser } = React.useContext(AuthContext);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = React.useState("");

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      console.log("email: " + formData.email + "\npassword: " + formData.password);
      if (!validateEmail(formData.email)) {
        setEmailError("Μη έγκυρο email");
        return;
      }
      setEmailError(""); // clear any previous errors
      LoginUser();
      props.setOpen(false);
    },
    [formData]
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" alignContent="center" rowSpacing={2} mt={3}>
          <Grid item>
            <Typography>Συμπληρώστε τα στοιχεία σύνδεσης</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="email"
              variant="outlined"
              sx={{ width: "100%" }}
              name="email"
              value={formData.email}
              error={Boolean(emailError)}
              helperText={emailError}
              onChange={(e) => {
                handleInputChange(e, setFormData);
                if (formData.email.length === 0) {
                  setEmailError("");
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Κωδικός"
              type="password"
              variant="outlined"
              sx={{ width: "100%" }}
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ textTransform: "none !important", width: "50%" }}
            >
              Σύνδεση
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

function SignUp(props: SignInUpProps) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateEmail(formData.email)) {
        setEmailError("Mη έγκυρο email");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setPasswordError("Oι κωδικοί δεν ταιριάζουν");
        return;
      }
      setEmailError("");
      props.setOpen(false);
    },
    [formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" alignContent="center" rowSpacing={2} mt={3}>
        <Grid item>
          <Typography>Συμπληρώστε τα στοιχεία εγγραφής</Typography>
        </Grid>
        <Grid item>
          <TextField
            label="email"
            variant="outlined"
            sx={{ width: "100%" }}
            name="email"
            value={formData.email}
            error={Boolean(emailError)}
            helperText={emailError}
            onChange={(e) => {
              handleInputChange(e, setFormData);
              if (formData.email.length === 0) {
                setEmailError("");
              }
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Κωδικός"
            type="password"
            variant="outlined"
            sx={{ width: "100%" }}
            name="password"
            value={formData.password}
            error={Boolean(passwordError)}
            helperText={passwordError}
            onChange={(e) => {
              handleInputChange(e, setFormData);
              if (formData.password.length === 0) {
                setPasswordError("");
              }
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Επιβεβαίωση Κωδικού"
            type="password"
            variant="outlined"
            sx={{ width: "100%" }}
            name="confirmPassword"
            value={formData.confirmPassword}
            error={Boolean(passwordError)}
            helperText={passwordError}
            onChange={(e) => handleInputChange(e, setFormData)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ textTransform: "none !important", width: "50%" }}
          >
            Εγγραφή
          </Button>
        </Grid>
      </Grid>
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
          <Box sx={{ justifyContent: "space-between", mt: 2 }}>
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
