import React from "react";
import NotFound from "./NotFound";
import { Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";

export default function Test() {
  React.useEffect(() => {
    axios
      .get("http://localhost:8080/category/all")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
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
