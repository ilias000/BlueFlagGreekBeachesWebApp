import React from "react";
import { Link } from "react-router-dom";
import AuthContext from "./Auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography, MenuItem, Menu, Grid, Button, Toolbar, AppBar } from "@mui/material";
import "../../css/index.css";
import LoginAndRegister from "./LoginAndRegister";

const RouteButton = ({ label, route, color }: { label: string; route: string; color: string }) => {
  return (
    <Link to={route}>
      <Typography variant="body1" color={color}>
        {label}
      </Typography>
    </Link>
  );
};

export default function Header() {
  const [openModal, setOpenModal] = React.useState(false);
  const [navMenu, setNavMenu] = React.useState<null | HTMLElement>(null);
  const [userMenu, setUserMenu] = React.useState<null | HTMLElement>(null);
  const { AuthData, LogoutUser } = React.useContext(AuthContext);

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
          <Grid container columnGap={3} justifyContent="flex-end" alignItems="center">
            {AuthData.isLoggedIn ? (
              <>
                {AuthData.role === "admin" && (
                  <Grid item>
                    <RouteButton label="Διαχείριση" route="/admin" color="white" />
                  </Grid>
                )}
                <Grid item>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => setUserMenu(e.currentTarget)}
                    style={{ backgroundColor: "inherit", padding: 0 }}
                  >
                    <AccountCircleIcon></AccountCircleIcon>
                  </button>
                  <Menu open={Boolean(userMenu)} anchorEl={userMenu} onClose={() => setUserMenu(null)}>
                    <MenuItem onClick={LogoutUser}>logout</MenuItem>
                  </Menu>
                </Grid>
              </>
            ) : (
              <Grid item sx={{ "@media (max-width: 600px)": { display: "none" } }}>
                <Grid container columnGap={3} justifyContent="flex-end" alignItems="center">
                  <Grid item>
                    <RouteButton label="Αναζήτηση" route="/search" color="white" />
                  </Grid>
                  <Grid item>
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
                </Grid>
              </Grid>
            )}
          </Grid>

          {/* Collapse appbar contents on xs devices */}
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
                  <RouteButton label="Αναζήτηση" route="/search" color="black" />
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
        </Toolbar>
      </AppBar>
      {openModal && <LoginAndRegister openModal={openModal} setOpenModal={setOpenModal} inputTab="login" />}
    </>
  );
}
