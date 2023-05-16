import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";
import AuthContext from "./Auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Modal, Tabs, Tab, Typography } from "@mui/material";
import "../../css/index.css";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const { AuthData, LogoutUser } = React.useContext(AuthContext);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "var(--primary-color)" }}>
        <Toolbar>
          <Grid container justifyContent="flex-start">
            <Link to={"/"}>
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
                <Grid>
                  <button
                    onClick={LogoutUser}
                    style={{ backgroundColor: "inherit", padding: 0 }}
                  >
                    <AccountCircleIcon></AccountCircleIcon>
                  </button>
                </Grid>
              </>
            ) : (
              <>
                <Grid display="flex" alignItems="center">
                  <Link to={"/search"}>
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-signin-signup"
        aria-describedby="modal-signin-signup-desc"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Tabs
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
              aria-label="basic tabs example"
            >
              <Tab label="ΣΥΝΔΕΣΗ" sx={{ ml: 0 }} />
              <Tab label="ΕΓΓΡΑΦΗ" sx={{ mr: 0 }} />
            </Tabs>
            <Button onClick={() => setOpen(false)}>
              <CloseIcon></CloseIcon>
            </Button>
          </Box>
          <Box>
            {value === 0 && <SignIn setOpen={setOpen} />}
            {value === 1 && <SignUp setOpen={setOpen} />}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
