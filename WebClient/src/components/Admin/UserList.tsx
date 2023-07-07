import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Box,
  Typography
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const headCellStyles = {
  color: 'white', 
  width: '50%'
};

const labelStyles = {
  fontSize: '1.1rem'
};

const rowHeight = '50vh';

export default function UserList() {1

  
  // Example of user data
  const users = [
    { id: 1, name: 'User1' },
    { id: 2, name: 'User2' },
    { id: 3, name: 'User3' },
    { id: 4, name: 'User4' },
    { id: 5, name: 'User5' },
    { id: 6, name: 'User6' },
    { id: 7, name: 'User7' },
    { id: 8, name: 'User8' },
    { id: 9, name: 'User9' },
    { id: 10, name: 'User10' },
    { id: 11, name: 'User11' },
    { id: 12, name: 'User12' },
    { id: 13, name: 'User13' },
    { id: 14, name: 'User14' },
    { id: 15, name: 'User15' },
  ];
  

  const usersPerPage = 10; // Number of users per page
  const [currentPage, setCurrentPage] = useState(1);
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteUser = (userId) => {
    // console.log(`Deleted user with ID: ${userId}`);
  };
  
  return (
    <>
      <TableContainer style={{ height: '90%' }}>
        <Table >
          <TableHead style={{ backgroundColor: 'var(--primary-color)' }}>
            <TableRow>
              <TableCell align='center' sx={ headCellStyles }>
                <Typography sx={ labelStyles }>
                  Χρήστης
                </Typography>
              </TableCell>
              <TableCell align='center' sx={ headCellStyles }>
                <Typography sx={ labelStyles }>
                  Λειτουργία
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}
                sx={{
                  '&:nth-of-type(even)': {
                    backgroundColor: '#bfc7f5',
                  }
                }}
              >
                <TableCell align='center' height={rowHeight}>
                    {user.name}
                </TableCell>
                <TableCell align='center' >
                  <IconButton sx={{borderRadius: '50%'}} onClick={() => handleDeleteUser(user.id)}>
                    <Delete height={rowHeight}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Fill the table with empty rows to keep the height constant */}
            {/* {currentUsers.length < usersPerPage &&
              Array(usersPerPage - currentUsers.length)
              .fill()
              .map((_, index) => (
                <TableRow key={`empty-row-${index}`} sx={{ height: rowHeight }} >
                </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" alignItems="center" style={{height: '10%'}}>
        <Pagination
          count={Math.ceil(users.length / usersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          size="large"
        />
      </Box>
    </>
  );
}
