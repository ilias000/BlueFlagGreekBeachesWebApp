import React from "react";
import Map from "./Map";
import AuthContext from "../Secondary/Auth";
import Header from "../Secondary/Header";
import Footer from "../Secondary/Footer";
import { Autocomplete, Box, Button, Checkbox, Grid, FormGroup, FormControlLabel, TextField } from "@mui/material";
import axios from "axios";

import { Close } from '@mui/icons-material';

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

  const [categories, setCategories] = React.useState<Category[]>([]);

  const [formData, setFormData] = React.useState<{ categories: string[]; keywords: string }>({
    categories: [],
    keywords: "",
  });

  const [selected, setSelected] = React.useState<google.maps.LatLng | null>();
  const [radius, setRadius] = React.useState<number | undefined>();
  const [points, setPoints] = React.useState<Pois[]>([]);
  const [start, setStart] = React.useState(0);

  React.useEffect(() => {
    // Get all categories when component is mounted
    axios
      .get("http://localhost:8080/category/all")
      .then((response) => {
        const catObjects: Category2[] = response.data;
        const formattedObjs = catObjects.map((category: Category2) => ({
          id: category.categoryId,
          name: category.name,
        }));
        setCategories(formattedObjs);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("lat: " + selected?.lat() + "\nlon: " + selected?.lng() + "\nrad meters: " + radius);
      axios
        .post("http://localhost:8080/pois/search", {
          start: start,
          count: 20,
          text: formData.keywords,
          filters: {
            distance:
              selected && radius ? { lat: selected?.lat(), lon: selected?.lng(), km: Math.round(radius / 1000) } : null,
            categoryIds: categories
              .filter((category: Category) => formData.categories.includes(category.name))
              .map((category: Category) => category.id),
          },
        })
        .then((response) => {
          const data = response.data;
          const points = data.data;
          setPoints(points);
        })
        .catch((error) => console.log(error));
    },
    [formData, radius, selected]
  );

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
                onClick={handleSearch}
              >
                ΑΝΑΖΗΤΗΣΗ
              </Button>
              {AuthData.isLoggedIn && (
                <FormGroup onChange={handleSaveSearch}>
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
      <Map
        selected={selected}
        setSelected={setSelected}
        radius={radius}
        setRadius={setRadius}
        points={points}
        start={start}
        setStart={setStart}
      />
      <Footer />
    </>
  );
}