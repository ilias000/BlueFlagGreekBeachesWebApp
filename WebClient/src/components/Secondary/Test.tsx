import React from "react";
import NotFound from "./NotFound";
import { Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";

function calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  const toRadians = (value: any) => (value * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

export default function Test() {
  React.useEffect(() => {
    // Calculate distance between circle center and point
    const distance = calculateDistance(38.1354, 23.5245, 38.1361, 24.0256);

    // Check if point is inside the circle
    const isInsideCircle = distance <= 44;
    console.log(isInsideCircle);
  }, []);

  return (
    <>
      {import.meta.env.VITE_DEBUG ? (
        <>
          <Grid container columnGap={3} justifyContent="flex-end">
            <Grid item>
              <button style={{ backgroundColor: "inherit", padding: 0 }}>
                <AccountCircleIcon
                  sx={{
                    padding: 0,
                  }}
                />
              </button>
            </Grid>
          </Grid>
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
}
