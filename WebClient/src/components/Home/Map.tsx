import React from "react";
import { Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
import { GoogleMap, Circle, Marker, MarkerClusterer, InfoWindow } from "@react-google-maps/api";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Places from "./Places";
import RoomIcon from "@mui/icons-material/Room";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Snackbar, Alert, Box, Pagination, IconButton, Tooltip } from "@mui/material";
import { Clusterer } from "@react-google-maps/marker-clusterer";

const iconDimensions = {
  height: "3rem",
  width: "3rem",
};

const infoWindowOptions = { pixelOffset: new google.maps.Size(0, -40) };

type Pois = {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
};

interface MapProps {
  selected: google.maps.LatLng | null | undefined;
  setSelected: React.Dispatch<React.SetStateAction<google.maps.LatLng | null | undefined>>;
  radius: number | undefined;
  setRadius: React.Dispatch<React.SetStateAction<number | undefined>>;
  points: Array<Pois>;
  start: number;
  setStart: React.Dispatch<React.SetStateAction<number>>;
}

export default function Map({ selected, setSelected, radius, setRadius, points, start, setStart }: MapProps) {
  const [map, setMap] = React.useState<google.maps.Map>();
  const [circle, setCircle] = React.useState<google.maps.Circle | null>();
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [selectPoint, setSelectPoint] = React.useState(false);
  const [displayCircle, setDisplayCircle] = React.useState(false);
  const [noPointSelected, setNoPointSelected] = React.useState(false);
  const [selectedMarker, setSelectedMarker] = React.useState<Pois | null>(null);
  const [keepInfoWindow, setKeepInfoWindow] = React.useState(false);

  const initcenter = React.useMemo(() => ({ lat: 39.0, lng: 23.5 }), []);
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
      gestureHandling: "greedy",
      minZoom: 7,
      // Display a cursor with a marker icon whenever the user wants to select a point. Get marker.png
      // from public folder and set the cursor to the bottom center of the marker (20 and 47 px).
      draggableCursor: selectPoint ? "url(marker.png) 20 47, auto" : null,
    }),
    [selectPoint]
  );
  const bounds = React.useMemo(() => new google.maps.LatLngBounds(), []);

  React.useEffect(() => {
    if (points.length === 0) return;
    points.map((point) => bounds.extend(new google.maps.LatLng(point.latitude, point.longitude)));
    if (map) {
      if (points.length === 1) {
        map.setZoom(10);
        map.panTo({ lat: points[0].latitude, lng: points[0].longitude });
      } else {
        map.fitBounds(bounds);
      }
    }
  }, [map, points, bounds]);

  const handleRadiusChange = React.useCallback(() => {
    if (!circle) return;
    setRadius(Math.round(circle.getRadius()));
  }, [circle]);

  const handleCenterChange = React.useCallback(() => {
    if (!circle) return;
    setSelected(circle.getCenter());
  }, [circle]);

  const findMyLocation = React.useCallback(() => {
    if (!map || typeof map === undefined) {
      console.error("unexpected error: Cannot display location since map is undefined");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelected(new google.maps.LatLng(lat, lng));
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
      setKeepInfoWindow(false);
      setSelectedMarker(null);
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
      console.log(temp_radius);
      setRadius(Math.round(temp_radius));
      setDisplayCircle(true);
    },
    [selected]
  );

  const handleDeleteCircle = React.useCallback(() => {
    setDisplayCircle(false);
    setRadius(undefined);
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
                    {points.length > 0 && (
                      <Paper variant="outlined">
                        <List
                          sx={{
                            width: "20rem",
                            maxWidth: "70vw",
                            bgcolor: "background.paper",
                            paddingBottom: "0.5rem",
                          }}
                        >
                          <>
                            {points.slice(start, start + 5).map((point, i) => (
                              <ListItem
                                key={i}
                                onMouseEnter={() => setSelectedMarker(point)}
                                onMouseLeave={() => {
                                  if (!keepInfoWindow) setSelectedMarker(null);
                                }}
                                onClick={() => {
                                  setKeepInfoWindow(true);
                                  setSelectedMarker(point);
                                }}
                                sx={{
                                  backgroundColor:
                                    keepInfoWindow && selectedMarker?.title === point.title ? "lightblue" : "inherit",
                                  "&:hover": {
                                    backgroundColor: "lightblue",
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <ListItemText primary={point.title} secondary={point.description} />
                              </ListItem>
                            ))}
                            {points.length / 5 > 1 && (
                              <ListItem>
                                <Pagination
                                  count={Math.ceil(points.length / 5)}
                                  defaultPage={start / 5 + 1}
                                  siblingCount={0}
                                  onChange={(e, value) => setStart((value - 1) * 5)}
                                  color="primary"
                                />
                              </ListItem>
                            )}
                          </>
                        </List>
                      </Paper>
                    )}
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
                      <IconButton onClick={() => findMyLocation()}>
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
                        <div key={i}>
                          <Marker
                            position={new google.maps.LatLng(point.latitude, point.longitude)}
                            clusterer={clusterer}
                            onClick={() => setSelectedMarker(point)}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </MarkerClusterer>

                {selectedMarker && (
                  <InfoWindow
                    position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                    onCloseClick={() => setSelectedMarker(null)}
                    options={infoWindowOptions}
                  >
                    <>
                      <button onClick={() => setSelectedMarker(null)} style={{ display: "none" }} aria-label="Close">
                        &times;
                      </button>
                      <div style={{ marginTop: "0.75rem" }}>{selectedMarker.title}</div>
                    </>
                  </InfoWindow>
                )}

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
