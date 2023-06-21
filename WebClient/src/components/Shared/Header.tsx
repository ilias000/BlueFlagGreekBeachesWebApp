import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";
import AuthContext from "./Auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Modal, Tabs, Tab, Typography, MenuItem, Menu, Grid, Button, Toolbar, AppBar } from "@mui/material";
import "../../css/index.css";

export default function Header() {
  const [openModal, setOpenModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorUserMenu, setAnchorUserMenu] = React.useState<null | HTMLElement>(null);
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
          <Grid container columnGap={3} justifyContent="flex-end" sx={{ '@media (max-width: 600px)': { display: 'none' } }}>
            {AuthData.isLoggedIn ? (
              <>
                <Grid>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorUserMenu(e.currentTarget)}
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
                    onClick={() => setOpenModal(true)}
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
          {AuthData.isLoggedIn &&
            <>
              <Grid container justifyContent="flex-end" sx={{ '@media (min-width: 601px)': { display: 'none' } }}>
                <Grid>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorUserMenu(e.currentTarget)}
                    style={{ backgroundColor: "inherit", padding: 0 }}
                  >
                    <AccountCircleIcon></AccountCircleIcon>
                  </button>
                </Grid>
              </Grid>
              <Menu open={Boolean(anchorUserMenu)} anchorEl={anchorUserMenu} onClose={() => setAnchorUserMenu(null)}>
                <MenuItem onClick={LogoutUser}>logout</MenuItem>
              </Menu>
            </>
          }

          {!AuthData.isLoggedIn &&
            <>
              <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
                sx={{ color: "white", '@media (min-width: 601px)': { display: 'none' } }}>
                <MenuIcon />
              </Button>

              <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                <MenuItem>
                  <Link to={"/search"}>
                    <Typography variant="body1" color="black">
                      Αναζήτηση
                    </Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); setOpenModal(true); }}>
                  Σύνδεση
                </MenuItem>
              </Menu>
            </>}

        </Toolbar>
      </AppBar >
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
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
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
              aria-label="basic tabs example"
              variant="fullWidth"
            >
              <Tab label="ΣΥΝΔΕΣΗ" />
              <Tab label="ΕΓΓΡΑΦΗ" />
            </Tabs>
          </Box>
          <Box>
            {value === 0 && <SignIn setOpen={setOpenModal} />}
            {value === 1 && <SignUp setOpen={setOpenModal} />}
          </Box>

          <Box sx={{ position: "absolute", top: "0.2rem", right: "0.2rem" }}>
            <Button onClick={() => setOpenModal(false)}>
              <CloseIcon></CloseIcon>
            </Button>
          </Box>
        </Box>
      </Modal >
    </>
  );
}
