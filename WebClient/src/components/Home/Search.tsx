import React from "react";
import Map from "./Map";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import AuthContext from "../Shared/Auth";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";

const district = [{ label: "Αττικής" }, { label: "Θεσσαλονίκης" }];
const municipality = [{ label: "Αθηναίων" }, { label: "Ζωγράφου" }];

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("submit");
};

export default function Search() {
  const { AuthData } = React.useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  // redirect users from /search to / if the specific path was selected
  React.useEffect(() => {
    if (location.pathname === "/search") {
      if (AuthData.isLoggedIn) {
        navigate("/");
      }
    }
  }, [AuthData]);

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit}>
        <Grid container columnGap={5} mt={3} mb={3}>
          <Grid>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={district}
              sx={{ width: 300, mt: 2 }}
              renderInput={(params) => <TextField {...params} label="Νομός" />}
            />
          </Grid>
          <Grid>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={municipality}
              sx={{ width: 300, mt: 2 }}
              renderInput={(params) => <TextField {...params} label="Δήμος" />}
            />
          </Grid>
          <Grid>
            <TextField
              sx={{ width: 300, mt: 2 }}
              label="λέξεις-κλειδιά"
              variant="outlined"
            />
          </Grid>
          <Grid>
            <Button
              type="submit"
              variant="text"
              sx={{ BackgroundColor: "var(--primary-color)", mt: 2 }}
            >
              ΑΝΑΖΗΤΗΣΗ
            </Button>
            {AuthData.isLoggedIn && (
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Αποθήκευση" />
              </FormGroup>
            )}
          </Grid>
        </Grid>
      </form>

      <Map />
      <Footer />
    </>
  );
}
