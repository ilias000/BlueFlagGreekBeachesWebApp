import React from "react";
import Map from "./Map";
import AuthContext from "../Secondary/Auth";
import Header from "../Secondary/Header";
import Footer from "../Secondary/Footer";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  FormGroup,
  FormControlLabel,
  TextField,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import baseAxios from "../../AxiosConfig";
import { useSearchParams } from "react-router-dom";
import { Close } from "@mui/icons-material";

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
  const [searchParams, setSearchParams] = useSearchParams();

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
    [allCategories]
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

  // SAVE SEARCH
  // --------------------------------------------------------

  // Save Search Box Checker
  const [saveSearchCheck, setSaveSearchCheck] = React.useState(false);
  const handleSaveSearchCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaveSearchCheck(event.target.checked);
  };

  const [showSaveSearchModal, setShowSaveSearchModal] = React.useState(false);
  // Search button handler
  const handleSearch = () => {
    if (AuthData.isLoggedIn && saveSearchCheck) {
      console.log("display save modal");
      setShowSaveSearchModal(true);
    }
  };
  // Save Search Title
  const [title, setTitle] = React.useState<string>("");
  // Save Search Modal
  const handleSaveSearch = async () => {
    // debugger;
    let requestBody = {
      title: title,
      text: formData.text,
      keywords: null,
      categoryIds: allCategories
        .filter((category: Category) => formData.categories.includes(category.name))
        .map((category: Category) => category.id),
      lat: selected?.lat(),
      lon: selected?.lng(),
      km: radius ? Math.round(radius / 1000) : null,
    };

    let user_email = AuthData.email;
    let url = `http://localhost:8080/pois/saveSearch?email=${user_email}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error("Save search request failed");
        setSaveSearchStatus(2);
      } else {
        setSaveSearchStatus(1);
      }
    } catch (error) {
      console.error("Save search failed");
      setSaveSearchStatus(2);
    } finally {
      setTitle("");
    }
  };
  // 0 : Display Save Search form, 1 : Display success msg, 2 : Display fail msg
  const [saveSearchStatus, setSaveSearchStatus] = React.useState(0);

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
                options={allCategories.map((category: Category) => category.name)}
                sx={inputBox}
                onChange={(e, value: string[]) => setFormData((prevData) => ({ ...prevData, categories: value }))}
                renderInput={(params) => <TextField {...params} label="Κατηγορίες" />}
              />
            </Grid>
            <Grid>
              <TextField
                label="λέξεις-κλειδιά"
                variant="outlined"
                onChange={(e) => setFormData((prevData) => ({ ...prevData, text: e.target.value }))}
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
                onClick={handleSearch}
              >
                ΑΝΑΖΗΤΗΣΗ
              </Button>
              {AuthData.isLoggedIn && (
                <FormGroup onChange={handleSaveSearchCheck}>
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

      <Modal
        open={showSaveSearchModal}
        onClose={() => {
          setShowSaveSearchModal(false);
          setSaveSearchStatus(0);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            boxShadow: 24,
            padding: 4,
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5 }}
            onClick={() => {
              setShowSaveSearchModal(false);
              setSaveSearchStatus(0);
            }}
          >
            <Close />
          </IconButton>

          {saveSearchStatus === 0 && (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="body1" align="center" gutterBottom>
                  Εισάγετε έναν τίτλο αναζήτησης:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Τίτλος"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  // Add an onChange handler to capture the input value
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Button variant="contained" onClick={handleSaveSearch}>
                    Αποθηκευση
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
          {saveSearchStatus === 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" align="center">
                Η αναζήτηση αποθηκεύτηκε με επιτυχία!
              </Typography>
            </Box>
          )}
          {saveSearchStatus === 2 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" align="center">
                Η αναζήτηση απέτυχε.
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>

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
      <Footer />
    </>
  );
}
