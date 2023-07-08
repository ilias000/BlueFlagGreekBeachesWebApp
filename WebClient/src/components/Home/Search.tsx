import React from "react";
import Map from "./Map";
import AuthContext from "../Secondary/Auth";
import Header from "../Secondary/Header";
import Footer from "../Secondary/Footer";
import { Autocomplete, Box, Button, Checkbox, Grid, FormGroup, FormControlLabel, TextField } from "@mui/material";
import axios from "axios";

const inputBox = {
  width: 300,
  mt: 2,
};

type Category = {
  id: number;
  name: string;
};

type Category2 = {
  categoryId: number;
  name: string;
};

type Pois = {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
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
          start: 0,
          count: 5,
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
                options={categories.map((category: Category) => category.name)}
                sx={inputBox}
                onChange={(e, value: string[]) => setFormData((prevData) => ({ ...prevData, categories: value }))}
                renderInput={(params) => <TextField {...params} label="Κατηγορίες" />}
              />
            </Grid>
            <Grid>
              <TextField
                label="λέξεις-κλειδιά"
                variant="outlined"
                onChange={(e) => setFormData((prevData) => ({ ...prevData, keywords: e.target.value }))}
                sx={inputBox}
              />
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
      <Map selected={selected} setSelected={setSelected} radius={radius} setRadius={setRadius} points={points} />
      <Footer />
    </>
  );
}
