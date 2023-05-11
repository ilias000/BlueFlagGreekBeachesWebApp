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

const district = [{ label: "Αττικής" }, { label: "Θεσσαλονίκης" }];
const municipality = [{ label: "Αθηναίων" }, { label: "Ζωγράφου" }];

export default function Search() {
  const { AuthData } = React.useContext(AuthContext);

  return (
    <>
      <Grid container columnGap={5} mt={3} mb={3}>
        <Grid>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={district}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Νομός" />}
          />
        </Grid>
        <Grid>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={municipality}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Δήμος" />}
          />
        </Grid>
        <Grid>
          <TextField label="λέξεις-κλειδιά" variant="outlined" />
        </Grid>
        <Grid>
          <Button
            variant="text"
            sx={{ BackgroundColor: "var(--primary-color)" }}
          >
            Αναζήτηση
          </Button>
          {AuthData.isLoggedIn && (
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="Αποθήκευση" />
            </FormGroup>
          )}
        </Grid>
      </Grid>
      <Map />
    </>
  );
}
