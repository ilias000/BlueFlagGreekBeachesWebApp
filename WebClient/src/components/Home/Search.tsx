import React from "react";
import Map from "./Map";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const district = [{ label: "Αττικής" }, { label: "θεσσαλονίκης" }];
const municipality = [{ label: "Αθηναίων" }, { label: "Ζωγράφου" }];

export default function Search() {
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
      </Grid>
      <Map />
    </>
  );
}
