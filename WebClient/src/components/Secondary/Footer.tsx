import React from "react";
import { Grid, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "../../css/index.css";
import LoginAndRegister from "./LoginAndRegister";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const iconStyles = {
  width: "24px",
  height: "24px",
  margin: "8px",
};

const linkStyles = {
  color: "var(--on-secondary) !important",
  ":hover": {
    color: "var(--primary-container) !important",
  },
};

const dividerStyles = {
  backgroundColor: "white",
  margin: "15px auto",
  width: "90%",
};

const Footer = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [tab, setTab] = React.useState<"login" | "register">("login");
  return (
    <>
      {openModal && <LoginAndRegister openModal={openModal} setOpenModal={setOpenModal} inputTab={tab} />}
      <footer className="CustomFooter">
        <Grid
          container
          columnGap={10}
          rowGap={2}
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ width: "50%", margin: "auto" }}
          direction="row"
          display="flex"
          textAlign="start"
        >
          <Grid item sx={{ margin: "inherit" }}>
            <Grid container direction="column" rowGap={0.5}>
              <Grid item>
                <Link to={"/search"}>
                  <Typography sx={linkStyles}>Αναζήτηση</Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to="/"
                  onClick={() => {
                    setOpenModal(true);
                    setTab("login");
                  }}
                >
                  <Typography sx={linkStyles}>Σύνδεση</Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to="/"
                  onClick={() => {
                    setOpenModal(true);
                    setTab("register");
                  }}
                >
                  <Typography sx={linkStyles}>Εγγραφή</Typography>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ margin: "inherit", paddingLeft: 1.25 }}>
            <Grid container direction="column" rowGap={0.5}>
              <Grid item>
                <Link to="/" color="inherit">
                  <Typography sx={linkStyles}>Σχετικά</Typography>
                </Link>
              </Grid>
              <Grid item sx={linkStyles}>
                <Link to="/">
                  <Typography sx={linkStyles}>Επικοινωνία</Typography>
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ margin: "inherit" }}>
            <Grid container direction="row">
              <Grid item>
                <Link to="/">
                  <TwitterIcon sx={{ ...iconStyles, ...linkStyles }} />
                </Link>
              </Grid>
              <Grid item>
                <Link to="/">
                  <FacebookIcon sx={{ ...iconStyles, ...linkStyles }} />
                </Link>
              </Grid>
              <Grid item>
                <Link to="/">
                  <InstagramIcon sx={{ ...iconStyles, ...linkStyles }} />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider variant="middle" sx={dividerStyles} />
        <Grid container justifyContent="center" alignItems="center">
          <small>Copyright &copy; {new Date().getFullYear()} WeDontByte</small>
        </Grid>
      </footer>
    </>
  );
};

export default Footer;
