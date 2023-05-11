import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Modal } from "@mui/base";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";
import AuthContext from "./Auth";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box } from "@mui/material";
import "../../css/index.css";

export default function Header(props: any) {
  const [open, setOpen] = React.useState(false);

  const { AuthData, LogoutUser } = React.useContext(AuthContext);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "var(--primary-color)" }}>
        <Toolbar>
          <Grid container justifyContent="flex-start">
            <Link to={"/"} onClick={() => props.setClickedSearch(false)}>
              <Grid>
                <Box
                  sx={{
                    height: "2.5rem",
                    width: "7rem",
                    backgroundColor: "var(--primary-container)",
                  }}
                ></Box>
              </Grid>
            </Link>
          </Grid>
          <Grid container columnGap={3} justifyContent="flex-end">
            {AuthData.isLoggedIn ? (
              <>
                <Grid container columnGap={1} justifyContent="flex-end">
                  <Grid display="flex" alignItems="center">
                    <Link to={"/"}>
                      <Typography variant="body1" color="white">
                        Αναζήτηση
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid display="flex" alignItems="center">
                    <Link to={"/notifications"}>
                      <Typography variant="body1" color="white">
                        Ειδοποιήσεις
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid display="flex" alignItems="center">
                    <Typography variant="body1" color="white">
                      {AuthData.username}
                    </Typography>
                  </Grid>
                  <Grid display="flex" alignItems="center">
                    <button
                      onClick={LogoutUser}
                      style={{ backgroundColor: "inherit" }}
                    >
                      <AccountCircleIcon></AccountCircleIcon>
                    </button>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid display="flex" alignItems="center">
                  <Link to={"/"} onClick={() => props.setClickedSearch(true)}>
                    <Typography variant="body1" color="white">
                      Αναζήτηση
                    </Typography>
                  </Link>
                </Grid>
                <Grid>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    sx={{
                      color: "var(--on-primary-container)",
                      backgroundColor: "var(--primary-container)",
                      ":hover": {
                        color: "var(--on-secondary)",
                        backgroundColor: "var(--secondary)",
                      },
                      textTransform: "none !important",
                    }}
                  >
                    Σύνδεση
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          {true ? <SignIn /> : <SignUp />}
          <Button onClick={() => setOpen(false)}>
            <CloseIcon></CloseIcon>
          </Button>
        </div>
      </Modal>
    </>
  );
}
