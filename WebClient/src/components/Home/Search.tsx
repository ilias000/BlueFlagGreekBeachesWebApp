import React from "react";
import Map from "./Map";
import AuthContext from "../Secondary/Auth";
import Header from "../Secondary/Header";
import Footer from "../Secondary/Footer";
import { Autocomplete, Box, Button, Checkbox, Grid, FormGroup, FormControlLabel, TextField } from "@mui/material";

const inputBox = {
  width: 300,
  mt: 2,
};

const categories = [{ label: "Αθηναίων" }, { label: "Ζωγράφου" }];

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("submit");
};

export default function Search() {
  const { AuthData } = React.useContext(AuthContext);

  return (
    <>
      <Header />
      <Box sx={{ width: "90%", margin: "0 auto", marginTop: "4rem", marginBottom: "1.5rem" }}>
        <form onSubmit={handleSubmit}>
          <Grid container columnGap={5} justifyContent="flex-start">
            <Grid>
              <Autocomplete
                multiple
                filterSelectedOptions
                disablePortal
                options={categories}
                sx={inputBox}
                renderInput={(params) => <TextField {...params} label="Κατηγορίες" />}
              />
            </Grid>
            <Grid>
              <TextField label="λέξεις-κλειδιά" variant="outlined" sx={inputBox} />
            </Grid>
            <Grid>
              <Button
                type="submit"
                variant="text"
                sx={{
                  BackgroundColor: "var(--primary-color)",
                  mt: 2,
                  height: AuthData.isLoggedIn ? "2.5rem" : "3.5rem",
                }}
              >
                ΑΝΑΖΗΤΗΣΗ
              </Button>
              {AuthData.isLoggedIn && (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }} />}
                    label={
                      <div
                        style={{
                          fontSize: 14,
                        }}
                      >
                        Αποθήκευση
                      </div>
                    }
                  />
                </FormGroup>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
      <Map />
      <Footer />
    </>
  );
}