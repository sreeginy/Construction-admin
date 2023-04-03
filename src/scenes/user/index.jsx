import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { toast } from 'react-toastify';

import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import { Constant } from '../../utils/Constant';
import moment from 'moment';
import messageStyle from '../../components/toast/toastStyle';
import DeleteDialogPopUp from '../../components/DialogPopUp';

import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import USERLIST from '../../_mock/users';
import { useState, useEffect } from 'react';
import { getPermission } from '../../utils/PermissionUtil';

import {
  UserMoreMenu,
  AddUser,
  EditUser,
  MoreMenu,
  ChangePasssword
} from '../../sections/@dashboard/user/user';



// Api Call
import apiClient from '../../api/apiClient';
import headers from '../../api/apiHeader';
import apiHandleError from '../../api/apiHandleError';

const placeholder = '/static/placeholder.jpg';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstName', label: 'First Name', alignRight: false },
  { id: 'lastName', label: 'Last Name ', alignRight: false },
  { id: 'email', label: ' Email', alignRight: false },
  { id: 'password', label: ' Password', alignRight: false },
  { id : ''},
  { id: 'createdAt', label: 'Create At', alignRight: false },

];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {

    return filter(array, (_user) => _user.pro_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('pro_name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const [userList, setUserList] = useState([]);


  const [searchBy, setSearchBy] = useState('firstName');


  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [user, setUser] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.pro_name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const openAddEditPopUp = (data) => {
    setOpen((open) => (open = !open));
    setUser(data);
  };

  const openChangePasswordPopUp = (user) => {
    setPasswordOpen(true);
    setUser(user);
  };

  const handleChangePasswordClose = () => {
    setPasswordOpen(false);
  };

  const openEditPopUp = (data) => {
    setEditOpen((editOpen) => (editOpen = !editOpen));
    setUser(data);
  };
  const openDeletePopUp = (data) => {
    setDeleteOpen((deleteOpen) => (deleteOpen = !deleteOpen));
    setUser(data);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    //setPermission(getPermission(Constant.USER));
    setIsLoading(true);
    getUsersList();
  }, []);


  const handleSuccess = () => {
    getUsersList();
  };


  const handleClick = (event, pro_name) => {
    const selectedIndex = selected.indexOf(pro_name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, pro_name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getUsersList = async () => {
    try {
      const response = await apiClient.get('/user/all', {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          setUserList(response.data.data);
        }
        // setUserList(response.data);
        setIsLoading(false);
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  
  const deleteUser = async (id) => {
    try {
      const response = await apiClient.get(`user/delete/${id}`, {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          handleDeleteClose();
          getUsersList();
        }
      } else {
        apiHandleError(response);
      }

      console.log('Delete', response);
    } catch (error) {
      console.log(error);
    }
  };


   

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyFail = (msg) => toast.error(msg, messageStyle);


  return (
    <>
 <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          {true && (
            <Button
              variant="contained"
              endIcon={<Iconify icon="carbon:add-filled" />}
              onClick={() =>
                openAddEditPopUp({
                  name: '',
                  email: '',
                  role: '',
                  createdAt: ''
                })
              }
            >
              Add User
            </Button>
          )}
        </Stack>
        {open ? <AddUser onClose={handleClose} data={user} onSuccess={handleSuccess} /> : ''}
        {editOpen ? <EditUser onClose={handleEditClose} data={user} /> : ''}
        {deleteOpen ? (
          <DeleteDialogPopUp onClose={handleDeleteClose} onDelete={() => deleteUser(user.id)} />
        ) : (
          ''
        )}
        {passwordOpen ? <ChangePasssword onClose={handleChangePasswordClose} data={user} /> : ''}
  
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />


          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={USERLIST.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, firstName, lastName, email, password, createdAt } = row;
                  const selectedUser = selected.indexOf(firstName) !== -1;

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                      </TableCell>

                      <TableCell align="left">{firstName}</TableCell>

                      <TableCell align="left">{lastName}</TableCell>
                      <TableCell align="left">{email}</TableCell>


                      <TableCell align="left">{password}</TableCell>

                
                     {/* <TableCell align="right">
                      <ProductMoreMenu
                                permission={permission}
                                onEditClick={() => handleOpenEdit(row)}
                                onDelete={() => openDeletePopUp(row)}
                                onViewClick={() => openViewPopUp(row)}
                                onImageClick={() => handleOpenImage(row)}
                              />
                      </TableCell> */}
              

                      <TableCell align="left">{createdAt ? moment(createdAt).format(Constant.LISTDATEFORMAT) : ''}</TableCell>

                    
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>


          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} 
           variant="contained" 
           startIcon={<Iconify icon="eva:plus-fill" />}
           onClick={() => 
           openAddEditPopUp ({
               id: '',
               name: '',
               type: '',
               description: '',
               isVerified: '',
               status: '',
               createdAt: new Date()
              })
            }/>
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover> */}
    </>
  );
}


