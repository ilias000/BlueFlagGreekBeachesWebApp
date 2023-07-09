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
  Typography,
  Modal,
  Button,
  Grid
} from '@mui/material';
import { Delete } from '@mui/icons-material';

interface User {
  email: string;
  isAdmin: boolean;
}

const headCellStyles: React.CSSProperties = {
  color: 'white',
  width: '50%',
};

const labelStyles: React.CSSProperties = {
  fontSize: '1.1rem',
};

const rowHeight = '25px';

export default function UserList() {

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    // Fetch the user list
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await fetch('http://localhost:8080/user/all');
      const data: User[] = await response.json();

      // const data = [
      //   { email: 'user1@example.com', isAdmin: true },
      //   { email: 'user2@example.com', isAdmin: false },
      //   { email: 'user3@example.com', isAdmin: false },
      //   { email: 'user4@example.com', isAdmin: false },
      //   { email: 'user5@example.com', isAdmin: false },
      //   { email: 'user6@example.com', isAdmin: false },
      //   { email: 'user7@example.com', isAdmin: false },
      //   { email: 'user8@example.com', isAdmin: false },
      //   { email: 'user9@example.com', isAdmin: false },
      //   { email: 'user10@example.com', isAdmin: true },
      //   { email: 'user11@example.com', isAdmin: false },
      //   { email: 'user12@example.com', isAdmin: false },
      //   { email: 'user13@example.com', isAdmin: false },
      //   { email: 'user14@example.com', isAdmin: false },
      //   { email: 'user15@example.com', isAdmin: true },
      // ];

      // Place the admins at the top of the list
      const sortedData = [...data].sort((a, b) => (b.isAdmin ? 1 : -1));
      setUsers(sortedData);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowConfirmationModal(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      console.log(userToDelete?.email)
      const responseDeleteUser = await fetch('http://localhost:8080/user/delete', {
        method: 'POST',
        body: JSON.stringify({ 
          email: userToDelete?.email
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!responseDeleteUser.ok) {
        throw new Error('Error deleting user');
      }
      // Refresh user list
      fetchUserList();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setShowConfirmationModal(false);  // Close the confirmation modal
    }
  };
  
  const handleModalClose = () => {
    setShowConfirmationModal(false);
  };
  

  const usersPerPage = 10; // Number of users per page
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  
  return (
    <>
      <TableContainer style={{ height: '90%' }}>
        <Table>
          <TableHead style={{ backgroundColor: 'var(--primary-color)' }}>
            <TableRow>
              <TableCell align="center" sx={headCellStyles}>
                <Typography sx={labelStyles}>Χρήστης</Typography>
              </TableCell>
              <TableCell align="center" sx={headCellStyles}>
                <Typography sx={labelStyles}>Λειτουργία</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(even)': {
                    backgroundColor: '#bfc7f5',
                  },
                }}
              >
                <TableCell align="center" height={rowHeight}>
                  {user.email} {user.isAdmin && <span style={{ color: 'red' }}>(admin)</span>}
                </TableCell>
                <TableCell height={rowHeight} align="center">
                  <IconButton
                    sx={{ borderRadius: '50%' }}
                    onClick={() => handleDeleteUser(user)}
                    disabled={user.isAdmin}
                    style={{ color: user.isAdmin ? 'red' : '' }}
                  >
                    <Delete height={rowHeight} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: '10%' }}
      >
        <Pagination
          count={Math.ceil(users.length / usersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          size="large"
        />
      </Box>

      <Modal open={showConfirmationModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: 'white',
            boxShadow: 24,
            padding: 4,
          }}
        >
          <Typography variant="body1" align="center" gutterBottom>
            Είστε βέβαιοι ότι θέλετε να διαγράψετε τον χρήστη: <br/><br/> {userToDelete?.email} ?
          </Typography>
          <Grid container spacing={2} justifyContent="center" mt={2}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleConfirmDelete}
              >
                Ναι
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleModalClose}
              >
                Ακύρωση
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
