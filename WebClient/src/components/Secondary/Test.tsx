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
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:8080/user/all"); // Replace with your actual API endpoint
        const jsonData = await response.json();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // The empty dependency array [] ensures the effect runs only once on component mount

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
