import React from "react";
import { Grid } from "@mui/material";
import { GoogleMap, Circle } from "@react-google-maps/api";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Places from "./Places";

export default function Map() {
  const [selected, setSelected] = React.useState<google.maps.LatLng | null>();
  const [map, setMap] = React.useState<google.maps.Map>();
  const [circle, setCircle] = React.useState<google.maps.Circle>();
  const [radius, setRadius] = React.useState(1500.0);
  const [mapLoaded, setMapLoaded] = React.useState(false);

  const hiddenMap = React.useMemo(() => false, []);
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
    }),
    []
  );

  const handleRadiusChange = React.useCallback(() => {
    if (!circle) return;
    setRadius(circle.getRadius());
  }, []);

  const handleCenterChange = React.useCallback(() => {
    if (!circle) return;
    setSelected(circle.getCenter());
  }, []);

  const findMyLocation = React.useCallback((setSelected: any) => {
    if (!map) return;
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

  return (
    <>
      {hiddenMap ? null : (
        <Grid
          container
          spacing={0}
          columnGap={5}
          rowGap={5}
          alignItems="center"
          justifyContent="center"
        >
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
          >
            <Places setSelected={setSelected} map={map}></Places>

            {mapLoaded && selected && (
              <>
                <Circle
                  onLoad={(circle) => setCircle(circle)}
                  center={selected}
                  radius={radius}
                  editable={true}
                  onRadiusChanged={handleRadiusChange}
                  onCenterChanged={handleCenterChange}
                />
              </>
            )}
            <button onClick={() => findMyLocation(setSelected)}>
              <MyLocationIcon
                sx={{
                  position: "absolute",
                  right: "1.1rem",
                  bottom: "7.5rem",
                  color: "black",
                }}
              />
            </button>
          </GoogleMap>
        </Grid>
      )}
    </>
  );
}
