import React from "react";
import { Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
import { GoogleMap, Circle, Marker, MarkerClusterer } from "@react-google-maps/api";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Places from "./Places";
import RoomIcon from "@mui/icons-material/Room";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Snackbar, Alert, Box, Pagination, IconButton, Tooltip } from "@mui/material";
import { Clusterer } from "@react-google-maps/marker-clusterer";

const generatePoints = (position: google.maps.LatLngLiteral) => {
  const points: Array<google.maps.LatLngLiteral> = [];
  for (let i = 0; i < 10; i++) {
    const direction = Math.random() < 0.5 ? -4 : 4;
    points.push({ lat: position.lat + Math.random() / direction, lng: position.lng + Math.random() / direction });
  }
  return points;
};

const iconDimensions = {
  height: "3rem",
  width: "3rem",
};

export default function Map() {
  const [selected, setSelected] = React.useState<google.maps.LatLng | null>();
  const [map, setMap] = React.useState<google.maps.Map>();
  const [circle, setCircle] = React.useState<google.maps.Circle | null>();
  const [radius, setRadius] = React.useState(1500.0);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [selectPoint, setSelectPoint] = React.useState(false);
  const [displayCircle, setDisplayCircle] = React.useState(false);
  const [noPointSelected, setNoPointSelected] = React.useState(false);

  const initcenter = React.useMemo(() => ({ lat: 39.0, lng: 23.5 }), []);
  const points = React.useMemo(() => generatePoints(initcenter), []);
  const options = React.useMemo(
    () => ({
      mapId: import.meta.env.VITE_CUSTOM_MAP_ID,
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
      fullscreenControl: true,
      restriction: {
        latLngBounds: { north: 41.8, east: 28.45, west: 18.9, south: 34.8 },
      },
      minZoom: 7,
      // Display a cursor with a marker icon whenever the user wants to select a point. Get marker.png
      // from public folder and set the cursor to the bottom center of the marker (20 and 47 px).
      draggableCursor: selectPoint ? "url(marker.png) 20 47, auto" : null,
    }),
    [selectPoint]
  );
  const bounds = React.useMemo(() => new google.maps.LatLngBounds(), []);

  React.useEffect(() => {
    points.map((point) => bounds.extend(point));
    if (map) {
      map.fitBounds(bounds);
    }
  }, [map, points, bounds]);

  const handleRadiusChange = React.useCallback(() => {
    if (!circle) return;
    setRadius(circle.getRadius());
  }, [circle]);

  const handleCenterChange = React.useCallback(() => {
    if (!circle) return;
    setSelected(circle.getCenter());
  }, [circle]);

  const findMyLocation = React.useCallback((setSelected: any, map: any) => {
    if (!map) {
      console.error("unexpected error: Cannot display location since map is undefined");
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelected({ lat, lng });
        map.setZoom(13);
        map.panTo({ lat, lng });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  const handleMapClick = React.useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!selectPoint || !e.latLng) return;
      setSelected(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
      setSelectPoint(false);
    },
    [selectPoint]
  );

  const handleDisplayCircle = React.useCallback(
    (map: any) => {
      if (!map) return;
      if (!selected) {
        setNoPointSelected(true);
        return;
      }
      const temp_radius = 5 * Math.pow(2, 22 - map.getZoom());
      setRadius(temp_radius);
      setDisplayCircle(true);
    },
    [selected]
  );

  const handleDeleteCircle = React.useCallback(() => {
    setDisplayCircle(false);
    setCircle(null);
    setSelected(null);
  }, []);

  const handleCloseNoPointSelected = () => {
    setNoPointSelected(false);
  };

  const MapButtons = () => {
    return (
      <>
        <Grid item>
          <Tooltip title="Επιλογή σημείου" placement="top">
            <IconButton onClick={() => setSelectPoint(true)}>
              <RoomIcon
                sx={{
                  ...iconDimensions,
                  color: "red",
                }}
              />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Ορισμός κύκλου" placement="top">
            <IconButton onClick={() => handleDisplayCircle(map)}>
              <CircleIcon
                sx={{
                  ...iconDimensions,
                  color: "grey",
                }}
              />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Διαγραφή κύκλου" placement="top">
            <IconButton onClick={handleDeleteCircle}>
              <DeleteIcon
                sx={{
                  ...iconDimensions,
                  color: "black",
                }}
              />
            </IconButton>
          </Tooltip>
        </Grid>
      </>
    );
  };

  return (
    <>
      <Snackbar
        open={noPointSelected}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleCloseNoPointSelected}
      >
        <Alert severity="warning" onClose={handleCloseNoPointSelected}>
          Πρέπει να επιλέξετε σημείο στον χάρτη
        </Alert>
      </Snackbar>
      <Grid container spacing={0} columnGap={5} rowGap={5} alignItems="center" justifyContent="center">
        {import.meta.env.VITE_HIDDEN_MAP === "true" ? (
          <Box
            sx={{
              width: "90vw",
              height: "70vh",
              backgroundColor: "grey",
            }}
          ></Box>
        ) : (
          <GoogleMap
            mapContainerStyle={{
              width: "90vw",
              height: "80vh",
            }}
            center={initcenter}
            zoom={8}
            options={options}
            onLoad={(map) => {
              setMap(map);
              setMapLoaded(true);
            }}
            onClick={handleMapClick}
          >
            {mapLoaded && (
              <>
                <Grid container position="relative" width="fit-content" mt={3} ml={3}>
                  <Grid item>
                    <Places setSelected={setSelected} map={map}></Places>
                  </Grid>
                  <Grid item sx={{ "@media (max-width: 600px)": { display: "none" } }}>
                    <Grid container direction="row">
                      <MapButtons />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container position="absolute" width="20rem" maxWidth="70vw" mt={3} ml={3}>
                  <Grid item>
                    <Paper variant="outlined">
                      <List
                        sx={{ width: "20rem", maxWidth: "70vw", bgcolor: "background.paper", paddingBottom: "0.5rem" }}
                      >
                        <>
                          {points.slice(0, 5).map((point, i) => (
                            <ListItem key={i}>
                              <ListItemText primary={"Σημείο " + i} secondary="περιγραφή" />
                            </ListItem>
                          ))}
                          <ListItem>
                            <Pagination count={10} defaultPage={1} siblingCount={0} color="primary" />
                          </ListItem>
                        </>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="column"
                  alignItems={"flex-end"}
                  sx={{ position: "absolute", bottom: "8rem", right: 0, width: "fit-content" }}
                >
                  <Grid item sx={{ "@media (min-width: 601px)": { display: "none" }, marginBottom: "3rem" }}>
                    <Grid container direction={"column"}>
                      <MapButtons />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Εμφάνιση της τοποθεσίας σας" placement="top">
                      <IconButton onClick={() => findMyLocation(setSelected, map)}>
                        <MyLocationIcon
                          sx={{
                            padding: "0.75rem",
                            color: "black",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>

                {/* display points in clusters */}
                <MarkerClusterer>
                  {(clusterer: Clusterer) => (
                    <>
                      {points.map((point, i) => (
                        <Marker key={i} position={point} clusterer={clusterer} />
                      ))}
                    </>
                  )}
                </MarkerClusterer>

                {/* display selected point from user with circle */}
                {selected && (
                  <>
                    <Marker position={selected} />
                    {displayCircle && (
                      <Circle
                        onLoad={(circle) => setCircle(circle)}
                        center={selected}
                        radius={radius}
                        editable={true}
                        onRadiusChanged={handleRadiusChange}
                        onCenterChanged={handleCenterChange}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </GoogleMap>
        )}
      </Grid>
    </>
  );
}
