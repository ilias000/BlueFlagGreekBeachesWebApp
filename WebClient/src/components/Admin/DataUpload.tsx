import React, { useState } from "react";
import { Button, Box, Typography, TextField, Divider, Snackbar, Grid } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const dividerStyles = {
  backgroundColor: "var(--primary-color)",
  margin: "0 auto",
  width: "100%",
};

export default function FileUploadForm() {
  const [categories, setCategories] = useState<File | null>(null);
  const [positions, setPositions] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleCategories = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCategories(file || null);
  };

  const handlePositions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPositions(file || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // CATEGORIES
      if (categories) {
        const formDataCategories = new FormData();
        formDataCategories.append("file", categories);

        const responseCategories = await fetch("http://localhost:8080/import/categories", {
          method: "POST",
          body: formDataCategories,
        });

        if (!responseCategories.ok) {
          throw new Error("Failed to upload categories");
        }

        setUploadSuccess(true);
      }

      // POSITIONS
      if (positions) {
        const formDataPositions = new FormData();
        formDataPositions.append("file", positions);

        const responsePositions = await fetch("http://localhost:8080/import/pois", {
          method: "POST",
          body: formDataPositions,
        });

        if (!responsePositions.ok) {
          throw new Error("Failed to upload positions");
        }

        setUploadSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setUploadSuccess(false);
    } finally {
      setShowToast(true);
    }
  };

  const handleToastClose = () => {
    setShowToast(false);
  };

  return (
    <>
      <Divider variant="middle" sx={dividerStyles} />

      <Grid container justifyContent="center" height="100%" sx={{ mt: "2rem" }}>
        <Grid item xs={12} sm={8} md={6}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={2}>
                <label>
                  <Typography style={{ fontSize: "1.1rem" }}>Κατηγορίες:</Typography>
                </label>
                <input type="file" id="categories" name="categories" onChange={handleCategories} accept=".csv" />
              </Box>
              <Box mb={2}>
                <label>
                  <Typography style={{ fontSize: "1.1rem" }}>Σημεία:</Typography>
                </label>
                <input type="file" id="positions" name="positions" onChange={handlePositions} accept=".csv" />
              </Box>
              <Button variant="contained" color="primary" type="submit">
                ΑΝΕΒΑΣΤΕ
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>

      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleToastClose}
          severity={uploadSuccess ? "success" : "error"}
          elevation={6}
          variant="filled"
        >
          {uploadSuccess ? "Τα δεδομένα ανέβηκαν επιτυχώς!" : "Αποτυχία ανεβάσματος δεδομένων!"}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
