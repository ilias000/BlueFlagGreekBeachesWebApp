import React, { useState, useEffect } from 'react';
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

export default function UserList() {

  
//   Example of user data
//   const users = [
//     { email: 'Email_1' },
//     { email: 'Email_2' },
//     { email: 'Email_3' },
//     { email: 'Email_4' },
//     { email: 'Email_5' },
//     { email: 'Email_6' },
//     { email: 'Email_7' },
//     { email: 'Email_8' },
//     { email: 'Email_9' },
//     { email: 'Email_10' },
//     { email: 'Email_11' },
//     { email: 'Email_12' },
//     { email: 'Email_13' },
//     { email: 'Email_14' },
//     { email: 'Email_15' },
//   ];


  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the user list
    fetchUserList();
  }, []);
  
  const fetchUserList = async () => {
    try {
      const response = await fetch('http://localhost:8080/user/all');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };
  

  const usersPerPage = 10; // Number of users per page
  const [currentPage, setCurrentPage] = useState(1);
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteUser = (email) => {
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
              <TableRow
                sx={{
                  '&:nth-of-type(even)': {
                    backgroundColor: '#bfc7f5',
                  }
                }}
              >
                <TableCell align='center' height={rowHeight}>
                    {user.email}
                </TableCell>
                <TableCell align='center' >
                  <IconButton sx={{borderRadius: '50%'}} onClick={() => handleDeleteUser(user.email)}>
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
