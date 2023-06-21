import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { TextField, Autocomplete } from "@mui/material";
import React from "react";

interface PlacesProps {
  setSelected: React.Dispatch<React.SetStateAction<google.maps.LatLng | null | undefined>>;
  map: google.maps.Map | undefined;
}

export default function Places({ setSelected, map }: PlacesProps) {
  let suggestions: string[] = React.useMemo(() => [], []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      bounds: { north: 41.8, east: 28.45, west: 18.9, south: 34.8 },
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
      .then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        setSelected(new google.maps.LatLng(lat, lng));
        map.setZoom(13);
        map.panTo({ lat, lng });
      })
      .catch((reason) => {
        console.log("reasong" + reason);
        alert("Η περιοχή δεν βρέθηκε");
      });
  }, []);

  if (status === "OK") {
    suggestions = data.slice(0, 1).map(({ structured_formatting }) => structured_formatting.main_text);
  }

  return (
    <>
      <Autocomplete
        freeSolo
        onChange={handleInput}
        options={suggestions}
        sx={{
          width: "15rem",
          top: "1rem",
          left: "1rem",
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
