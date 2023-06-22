import React from "react";
import { Grid } from "@mui/material";
import { GoogleMap, Circle, Marker } from "@react-google-maps/api";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Places from "./Places";
import Box from "@mui/material/Box";
import RoomIcon from "@mui/icons-material/Room";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Map() {
  const [selected, setSelected] = React.useState<google.maps.LatLng | null>();
  const [map, setMap] = React.useState<google.maps.Map>();
  const [circle, setCircle] = React.useState<google.maps.Circle>();
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
  }, []);

  const handleCenterChange = React.useCallback(() => {
    if (!circle) return;
    setSelected(circle.getCenter());
  }, []);

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
    if (!map) {
      console.log("map is undefined");
      return;
    }
    console.log(map.getZoom());
    const temp_radius = 5 * Math.pow(2, 22 - map.getZoom());
    console.log(temp_radius);
    setRadius(temp_radius);
    setDisplayCircle(true);
  }, []);

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
                <Places setSelected={setSelected} map={map}></Places>
                <button onClick={() => findMyLocation(setSelected, map)}>
                  <MyLocationIcon
                    sx={{
                      position: "absolute",
                      right: "1.1rem",
                      bottom: "7.5rem",
                      color: "black",
                    }}
                  />
                </button>
                <button onClick={() => setSelectPoint(true)}>
                  <RoomIcon
                    sx={{
                      position: "absolute",
                      left: "17rem",
                      top: "1rem",
                      height: "3rem",
                      width: "3rem",
                      color: "red",
                    }}
                  />
                </button>
                <button onClick={() => handleDisplayCircle(map)}>
                  <CircleIcon
                    sx={{
                      position: "absolute",
                      left: "20rem",
                      top: "1rem",
                      height: "3rem",
                      width: "3rem",
                      color: "grey",
                    }}
                  />
                </button>
                <button
                  onClick={() => {
                    setDisplayCircle(false);
                    setSelected(null);
                  }}
                >
                  <DeleteIcon
                    sx={{
                      position: "absolute",
                      left: "23rem",
                      top: "1rem",
                      height: "3rem",
                      width: "3rem",
                      color: "red",
                    }}
                  />
                </button>

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
