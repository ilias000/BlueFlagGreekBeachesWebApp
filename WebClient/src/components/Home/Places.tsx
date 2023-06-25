import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { TextField, Autocomplete, Snackbar, Alert } from "@mui/material";
import React from "react";

interface PlacesProps {
  setSelected: React.Dispatch<React.SetStateAction<google.maps.LatLng | null | undefined>>;
  map: google.maps.Map | undefined;
}

export default function Places({ setSelected, map }: PlacesProps) {
  const [notFound, setNotFound] = React.useState(false);
  let suggestions: string[] = React.useMemo(() => [], []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      locationRestriction: { north: 41.8, east: 28.45, west: 18.9, south: 34.8 },
      componentRestrictions: { country: "gr" },
      language: "el",
      region: "gr",
      types: ["(cities)"],
    },
    debounce: 500,
  });

  const handleInput = React.useCallback((e: React.FormEvent, value: string | null) => {
    if (!value) return;
    if (!map) {
      console.error("Unexpected error: cannot display location of place since map is undefined");
      return;
    }
    clearSuggestions();
    getGeocode({ address: value, componentRestrictions: { country: "gr" } })
      .then((value) => {
        console.log(value);
        const { lat, lng } = getLatLng(value[0]);
        const point = new google.maps.LatLng(lat, lng);
        // point (39.074208, 21.824312) is returned for ivalid places
        if (point.lat() == 39.074208 && point.lng() == 21.824312) {
          setNotFound(true);
          return;
        }
        setSelected(new google.maps.LatLng(lat, lng));
        map.setZoom(13);
        map.panTo({ lat, lng });
      })
      .catch((reason) => {
        console.log("reason: " + reason);
        setNotFound(true);
      });
  }, []);

  if (status === "OK") {
    suggestions = data.slice(0, 1).map(({ structured_formatting }) => structured_formatting.main_text);
  }

  return (
    <>
      <Snackbar
        open={notFound}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setNotFound(false)}
      >
        <Alert severity="error" onClose={() => setNotFound(false)}>
          Η περιοχή δεν βρέθηκε
        </Alert>
      </Snackbar>
      <Autocomplete
        freeSolo
        onChange={handleInput}
        options={suggestions}
        sx={{
          width: "15rem",
          maxWidth: "70vw",
          backgroundColor: "white",
          position: "relative",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            value={value}
            disabled={!ready}
            placeholder="Αναζήτηση περιοχής"
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      />
    </>
  );
}
