import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LoginAndRegister from "../Secondary/LoginAndRegister";
import Header from "../Secondary/Header";
import Footer from "../Secondary/Footer";

export default function Welcome() {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <>
      <Header />
      <Grid container direction="row" mt={15}>
        <Grid item xs={2}></Grid>
        <Grid item xs={10}>
          <Grid container direction="column" rowGap={15} sx={{ width: "70vw" }}>
            <Grid item xs={12}>
              <Grid container direction="column" rowGap={3}>
                <Grid item>
                  <Typography variant="h4">Καλωσήρθατε στο BlueFlagSpotter</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    Το καλύτερο site για να βρείτε όλες τις ακτές με γαλάζια σημαία στην Ελλάδα και με συχνές
                    ενημερώσεις
                  </Typography>
                </Grid>
                <Grid item>
                  <Link to="/search">
                    <Button
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
                      Ξεκινήστε εδώ
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="row" columnGap={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">Αναζητήστε για περιοχές που σας ενδιαφέρουν</Typography>
                  <Typography variant="body1" align="justify" mt={3}>
                    Από την σελίδα αναζήτησης μπορείτε να βρείτε τις ακτές που έχουν βραβευτεί με γαλάζια σημαία στις
                    περιοχές που σας ενδιαφέρουν. Πιο συγκεκριμένα, μπορείτε να επιλέξετε τον Νομό και Δήμο για τους
                    οποίους θέλετε να αναζητήσετε παραλίες.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ backgroundColor: "var(--primary-container)" }}></Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row">
                <Grid item xs={12} sm={6}></Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">Λάβετε Ενημερώσεις</Typography>
                  <Typography variant="body1" align="justify" mt={3}>
                    Αν είστε χρήστης της εφαρμογής έχετε τη δυνατότητα να επιλέξετε συγκεκριμενές περιοχές για τις
                    οποίες θέλετε να λαμβάνετε ενημερώσεις. Καθώς πραγματοποιείτε αναζητήσεις μεταβείτε στον χάρτη,
                    περιηγηθείτε στην τοποθεσία που σας ενδιαφέρει μέσω της αναζήτησης και πατήστε κλικ σε ένα σημείο
                    στον χάρτη. Διαφορετικά μπορείτε να αποθηκεύσετε αναζητήσεις για έναν Νομό ή Δήμο. Τέλος, κάντε κλίκ
                    στο κουμπί αποθήκευσης.
                  </Typography>
                  <Button
                    onClick={() => {
                      setOpenModal(true);
                    }}
                    variant="contained"
                    sx={{
                      mt: 5,
                      color: "var(--on-primary-color)",
                      backgroundColor: "var(--primary-color)",
                      ":hover": {
                        color: "var(--primary-container)",
                        backgroundColor: "var(--on-primary-container)",
                      },
                      textTransform: "none !important",
                    }}
                  >
                    Εγγραφή Τώρα
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {openModal && <LoginAndRegister openModal={openModal} setOpenModal={setOpenModal} inputTab={"register"} />}
      <Footer />
    </>
  );
}
