import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';

import Header from "../Secondary/Header";
import Footer from "../Secondary/Footer";
import UserList from "./UserList";
import DataUpload from "./DataUpload";

export default function Admin() {

  const [adminTab, setadminTab] = useState('usersTab');
  const handleAdminTab = (event, tab) => {
    setadminTab(tab);
  };

  return (
    <>
      <Header />

      <Box sx={{ width: "60%", margin: "0 auto", marginTop: "5.5rem"}}>
        <Tabs value={adminTab} onChange={handleAdminTab} centered 
              sx={{
                '& .MuiTab-root': {
                  margin: '0 10%',
                },
                marginBottom: '1.5rem'
              }}>
          <Tab value='usersTab' label=" ΛΙΣΤΑ ΧΡΗΣΤΩΝ" />
          <Tab value='dataTab' label="ΔΕΔΟΜΕΝΑ" />
        </Tabs>

        <Box style={{ height: '90vh' }}>
          {adminTab === 'usersTab' && <UserList />}
          {adminTab === 'dataTab' && <DataUpload />}
        </Box>
      </Box>

      <Footer />
    </>
  );

}