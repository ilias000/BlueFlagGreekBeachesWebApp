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
  const [navMenu, setNavMenu] = React.useState<null | HTMLElement>(null);
  const [userMenu, setUserMenu] = React.useState<null | HTMLElement>(null);
  const [tab, setTab] = React.useState(0);
  const { AuthData, LogoutUser } = React.useContext(AuthContext);

  const userProfile = React.useCallback(() => {
    return (
      <Grid>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => setUserMenu(e.currentTarget)}
          style={{ backgroundColor: "inherit", padding: 0 }}
        >
          <AccountCircleIcon></AccountCircleIcon>
        </button>
      </Grid>
    );
  }, []);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "var(--primary-color)" }}>
        <Toolbar>
          {/* logo */}
          <Grid container>
            <Grid item justifyContent="flex-start">
              <Link to={"/"}>
                <Box
                  sx={{
                    height: "2.5rem",
                    width: "7rem",
                    backgroundColor: "var(--primary-container)",
                  }}
                ></Box>
              </Link>
            </Grid>
          </Grid>

          {/* Display appbar contents above xs device width and use dynamic display based on log-in status */}
          <Grid
            container
            columnGap={3}
            justifyContent="flex-end"
            sx={{ "@media (max-width: 600px)": { display: "none" } }}
          >
            {AuthData.isLoggedIn ? (
              <>{userProfile()}</>
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

          {/* Collapse appbar contents on xs devices. There is no need to collapse for logged in users*/}
          {!AuthData.isLoggedIn && (
            <>
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => setNavMenu(e.currentTarget)}
                sx={{
                  color: "white",
                  "@media (min-width: 601px)": { display: "none" },
                }}
              >
                <MenuIcon />
              </Button>

              <Menu open={Boolean(navMenu)} anchorEl={navMenu} onClose={() => setNavMenu(null)}>
                <MenuItem>
                  <Link to={"/search"}>
                    <Typography variant="body1" color="black">
                      Αναζήτηση
                    </Typography>
                  </Link>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setNavMenu(null);
                    setOpenModal(true);
                  }}
                >
                  Σύνδεση
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Display user icon if user is logged in */}
          {AuthData.isLoggedIn && (
            <>
              <Grid container justifyContent="flex-end" sx={{ "@media (min-width: 601px)": { display: "none" } }}>
                {userProfile()}
              </Grid>
              <Menu open={Boolean(userMenu)} anchorEl={userMenu} onClose={() => setUserMenu(null)}>
                <MenuItem onClick={LogoutUser}>logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
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
            {tab === 0 && <SignIn setOpen={setOpenModal} />}
            {tab === 1 && <SignUp setOpen={setOpenModal} />}
          </Box>

          <Box sx={{ position: "absolute", top: "0.2rem", right: "0.2rem" }}>
            <Button onClick={() => setOpenModal(false)}>
              <CloseIcon></CloseIcon>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
