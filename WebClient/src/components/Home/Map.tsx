import React from "react";
import { Grid } from "@mui/material";
import { GoogleMap, Circle, Marker } from "@react-google-maps/api";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Places from "./Places";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import RoomIcon from "@mui/icons-material/Room";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";

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
      minZoom: 7,
      // Display a cursor with a marker icon whenever the user wants to select a point. Get marker.png
      // from public folder and set the cursor to the bottom center of the marker (20 and 47 px).
      draggableCursor: selectPoint ? "url(marker.png) 20 47, auto" : null,
    }),
    [selectPoint]
  );

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

  const handleDisplayCircle = React.useCallback((map: any) => {
    if (!map) return;
    const temp_radius = 5 * Math.pow(2, 22 - map.getZoom());
    setRadius(temp_radius);
    setDisplayCircle(true);
  }, []);

  const handleDeleteCircle = React.useCallback(() => {
    setDisplayCircle(false);
    setCircle(null);
    setSelected(null);
  }, []);

  const MapButtons = () => {
    return (
      <>
        <Grid item>
          <Button onClick={() => setSelectPoint(true)}>
            <RoomIcon
              sx={{
                ...iconDimensions,
                color: "red",
              }}
            />
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={() => handleDisplayCircle(map)}>
            <CircleIcon
              sx={{
                ...iconDimensions,
                color: "grey",
              }}
            />
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={handleDeleteCircle}>
            <DeleteIcon
              sx={{
                ...iconDimensions,
                color: "black",
              }}
            />
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <>
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
              height: "70vh",
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
                <Grid container position="relative" mt={3} ml={3}>
                  <Grid item>
                    <Places setSelected={setSelected} map={map}></Places>
                  </Grid>
                  <Grid item sx={{ "@media (max-width: 600px)": { display: "none" } }}>
                    <Grid container direction="row">
                      <MapButtons />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="column"
                  alignItems={"flex-end"}
                  sx={{ position: "absolute", bottom: "8rem" }}
                >
                  <Grid item sx={{ "@media (min-width: 601px)": { display: "none" }, marginBottom: "3rem" }}>
                    <Grid container direction={"column"}>
                      <MapButtons />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Button onClick={() => findMyLocation(setSelected, map)}>
                      <MyLocationIcon
                        sx={{
                          color: "black",
                        }}
                      />
                    </Button>
                  </Grid>
                </Grid>

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
