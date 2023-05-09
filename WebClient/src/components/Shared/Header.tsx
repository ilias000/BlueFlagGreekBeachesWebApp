import React, { useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import "../../css/index.css";

export default function Header(props: object) {
  const [clicked, setClicked] = React.useState(false);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "var(--primary-color)" }}>
        <Toolbar>
          <Grid container columnGap={3} justifyContent="flex-end">
            <Grid>
              <>
                <Button
                  onClick={() => setClicked(true)}
                  variant="contained"
                  sx={{
                    color: "var(--on-primary-container)",
                    backgroundColor: "var(--primary-container)",
                    ":hover": {
                      color: "var(--on-secondary)",
                      backgroundColor: "var(--secondary)",
                    },
                  }}
                >
                  ΣΥΝΔΕΣΗ
                </Button>
              </>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
