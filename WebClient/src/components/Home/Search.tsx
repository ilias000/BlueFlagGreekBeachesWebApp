import React from "react";
import Map from "./Map";
import AuthContext from "../Secondary/Auth";
import Header from "../Secondary/Header";
import Footer from "../Secondary/Footer";
import { Autocomplete, Box, Button, Checkbox, Grid, FormGroup, FormControlLabel, TextField } from "@mui/material";
<<<<<<< HEAD
import baseAxios from "../../AxiosConfig";
import { useSearchParams } from "react-router-dom";
=======
>>>>>>> main

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
  const [searchParams, setSearchParams] = useSearchParams();

<<<<<<< HEAD
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);

  const [formData, setFormData] = React.useState<{ categories: string[]; text: string }>({
    categories: [],
    text: "",
  });

  const [selected, setSelected] = React.useState<google.maps.LatLng | null>();
  const [radius, setRadius] = React.useState<number | undefined>();
  const [points, setPoints] = React.useState<Pois[]>([]);
  const [start, setStart] = React.useState(0);
  const [totalPoints, setTotalPoints] = React.useState(0);

  const handleRequest = React.useCallback(
    (
      start: number,
      text: string | null,
      categories: string[] | null | undefined,
      lat: number | null | undefined,
      lon: number | null | undefined,
      km: number | null | undefined
    ) => {
      baseAxios
        .post("pois/search", {
          start: start,
          count: 5, // default count
          text: text,
          filters: {
            distance: lat && lon && km ? { lat: lat, lon: lon, km: km } : null,
            categoryIds: categories
              ? allCategories
                  .filter((category: Category) => categories.includes(category.name))
                  .map((category: Category) => category.id)
              : null,
          },
        })
        .then((response) => {
          const data = response.data;
          const total = data.total;
          setTotalPoints(total);
          const points = data.data;
          setPoints(points);
        })
        .catch((error) => console.log(error));
    },
    []
  );

  React.useEffect(() => {
    // Get all categories when component is mounted
    baseAxios
      .get("category/all")
      .then((response) => {
        const catObjects: Category2[] = response.data;
        const formattedObjs = catObjects.map((category: Category2) => ({
          id: category.categoryId,
          name: category.name,
        }));
        setAllCategories(formattedObjs);
      })
      .catch((error) => console.log(error));

    // Read parameters to search with link at initial mount
    const url = new URL(window.location.href);
    const strStart: string | null = url.searchParams.get("page");
    const start: number | null = strStart ? (parseInt(strStart) - 1) * 5 : null;
    const text = searchParams.get("text");
    const categories: string[] | null | undefined = searchParams
      .get("categories")
      ?.split(",")
      .map((category: string) => category.trim());
    const strLat: string | null = searchParams.get("lat");
    const lat: number | null = strLat ? parseFloat(strLat) : null;
    const strLon: string | null = searchParams.get("lon");
    const lon: number | null = strLon ? parseFloat(strLon) : null;
    const strKm: string | null = searchParams.get("km");
    const km: number | null = strKm ? parseFloat(strKm) : null;

    // start is essential parameter to handleRequest
    if (start !== null) {
      handleRequest(start, text, categories, lat, lon, km);
    }
  }, [start]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Make the api call
      const km = radius ? Math.round(radius / 1000) : undefined;
      handleRequest(0, formData.text, formData.categories, selected?.lat(), selected?.lng(), km);
      // Set parameters to url
      const params = {
        text: formData.text,
        categories: formData.categories.join(","),
        lat: selected ? selected?.lat().toString() : "",
        lon: selected ? selected?.lng().toString() : "",
        km: radius ? Math.round(radius / 1000).toString() : "",
        page: "1",
      };
      setSearchParams(params);
    },
    [formData, radius, selected]
  );

=======
>>>>>>> main
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
<<<<<<< HEAD
                options={allCategories.map((category: Category) => category.name)}
=======
                options={categories}
>>>>>>> main
                sx={inputBox}
                renderInput={(params) => <TextField {...params} label="Κατηγορίες" />}
              />
            </Grid>
            <Grid>
<<<<<<< HEAD
              <TextField
                label="λέξεις-κλειδιά"
                variant="outlined"
                onChange={(e) => setFormData((prevData) => ({ ...prevData, text: e.target.value }))}
                sx={inputBox}
              />
=======
              <TextField label="λέξεις-κλειδιά" variant="outlined" sx={inputBox} />
>>>>>>> main
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
<<<<<<< HEAD
      <Map
        selected={selected}
        setSelected={setSelected}
        radius={radius}
        setRadius={setRadius}
        points={points}
        start={start}
        setStart={setStart}
        totalPoints={totalPoints}
      />
=======
>>>>>>> main
      <Footer />
    </>
  );
}