import React, { useState } from 'react';
import { Button, Box, Typography, TextField, Divider } from '@mui/material';

const dividerStyles = {
  backgroundColor: 'var(--primary-color)',
  margin: "0 auto",
  width: "100%",
};

export default function FileUploadForm() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFile1Change = (event) => {
    setFile1(event.target.files[0]);
  };

  const handleFile2Change = (event) => {
    setFile2(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform file upload or further processing
    console.log(file1);
    console.log(file2);
  };

  return (
    <>
      <Divider variant="middle" sx={dividerStyles} />
      
      <Box height='100%' my={2}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box mb={2}>
              <label>
                <Typography style={{fontSize: '1.1rem'}}>Κατηγορίες:</Typography>
              </label>
              <input
                type="file"
                id="file1"
                name="file1"
                onChange={handleFile1Change}
                accept=".csv"
              />
            </Box>
            <Box mb={2}>
              <label>
                <Typography style={{fontSize: '1.1rem'}}>Σημεία:</Typography>
              </label>
              <input
                type="file"
                id="file2"
                name="file2"
                onChange={handleFile2Change}
                accept=".csv"
              />
            </Box>
            <Button variant="contained" color="primary" type="submit">
              ΑΝΕΒΑΣΤΕ
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}
