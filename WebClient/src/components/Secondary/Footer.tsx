import React from 'react';
import { Grid, Link, Divider } from '@mui/material';
import "../../css/index.css";

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const footerStyles = {
  backgroundColor: "var(--secondary)",
  padding: '16px',
  color: 'white',
};

const columnStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const iconStyles = {
  width: '24px',
  height: '24px',
  margin: '8px',
};

const socialIconContainerStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
};

const linkStyles = {
  textDecoration: 'none',
  color: 'inherit',
  ":hover": {
    color: "var(--primary-color)"
  }
}

const dividerStyles = {
  backgroundColor: 'white', 
  margin: '15px auto',
  width: '90%'
}

const Footer = () => {
  return (
    <footer style={footerStyles}>
      <Grid container spacing={1}> {/* Decreased spacing to make it more compact */}
        <Grid item xs={12} sm={6} md={4} sx={columnStyles}>
          <Link href="/search" sx={linkStyles} > Αναζήτηση </Link>
          <Link href="#" sx={linkStyles}> Σύνδεση </Link>
          <Link href="#" sx={linkStyles}> Εγγραφή </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={columnStyles}>
          <Link href="#" sx={linkStyles}> Σχετικά </Link>
          <Link href="#" sx={linkStyles}> Επικοινωνία </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={socialIconContainerStyles}>
          <Link href="#" sx={linkStyles}> <TwitterIcon sx={iconStyles} /> </Link>
          <Link href="#" sx={linkStyles}> <FacebookIcon sx={iconStyles} /> </Link>
          <Link href="#" sx={linkStyles}> <InstagramIcon sx={iconStyles} /> </Link>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={dividerStyles} />
      <small style={{ textAlign: 'center' }}>
        Copyright &copy; {new Date().getFullYear()} WeDontByte
      </small>
    </footer>
  );
};

export default Footer;
