import { Box, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import DeleteDialogPopUp from '../../components/DialogPopUp';
import messageStyle from '../../components/toast/toastStyle';

import { Constant } from '../../utils/Constant';
import { getPermission } from '../../utils/PermissionUtil';
import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { toast } from 'react-toastify';

// @mui
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

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// import USERLIST from '../../_mock/customer';

// Api Call
import apiClient from '../../api/apiClient';
import headers from '../../api/apiHeader';
import apiHandleError from '../../api/apiHandleError';

import {
  AddEditRolePopUp,
  RoleListHead,
  RoleListToolbar,
  RoleMoreMenu,
} from '../../sections/@dashboard/role';

import { MoreMenu } from '../../sections/@dashboard/user/user'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'accessLevel', label: 'Access Level', alignRight: false, isSort: true },
  // { id: 'email', label: 'E-Mail', alignRight: false, isSort: true },
  // { id: 'password', label: 'Password', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false, isSort: true },
  { id: '' },
  { id: 'createdAt', label: 'Created At', alignRight: false, isSort: true },
];


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
    return filter(array, (_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function Customer() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('email');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState();
  const [SelectedCustomerId, setSelectedCustomerId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);


  const [roleList, setRoleList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState({});
  const [customer, setCustomer] = useState();
  const [selectedData, setselectedData] = useState();


  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);

  const openAddEditPopUp = (data) => {
    setOpen((open) => (open = !open));
    setselectedData(data);
  };

  const openEditPopUp = (data) => {
    setOpen((open) => (open = !open));
    setselectedData(data);
  };
  const openDeletePopUp = (data) => {
    setDeleteOpen((deleteOpen) => (deleteOpen = !deleteOpen));
    setselectedData(data);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handleClose = () => {
    console.log('close');
    setOpen(false);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = roleList.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, email) => {
    const selectedIndex = selected.indexOf(email);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, email);
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

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };



  useEffect(() => {
    //  setPermission(getPermission(Constant.CUSTOMERPAGE));
    // setIsLoading(true);
    getRoleList();
  }, []);


  const getRoleList = async () => {
    try {
      const response = await apiClient.get('role/all', {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          setRoleList(response.data.data);
        }
        // setUserList(response.data);
        // setIsLoading(false);
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };


  const handleSuccess = () => {
    getRoleList();
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await apiClient.delete(`role/delete/${id}`, {
        headers: headers()
      });
      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          handleDeleteClose();
          getRoleList();
        }
      } else {
        apiHandleError(response);
      }
      console.log('post', response);
    } catch (error) {
      setDeleteOpen(false);
      notifyError('Customer has in order');
      console.log(error);
    }
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roleList.length) : 0;

  const filteredUsers = applySortFilter(roleList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  // const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyFail = (msg) => toast.error(msg, messageStyle);


  return (
    <>


      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom >
            ROLE &nbsp; LIST
          </Typography>
          {/* <Typography  alignItems="center">Create a New User Profile</Typography>  */}
          {/* {permission?.read && ( */}
          {true && (
            <Button
              // color="info" 
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() =>
                openAddEditPopUp({

                  accessLevel: '',
                  email: '',
                  // password: '',
                  description: '',
             
        
                })
              }
            >
              Add New Role
            </Button>
          )}
          {/* )}    */}
        </Stack>

        {open ? (
          <AddEditRolePopUp onClose={handleClose} data={selectedData}
            onSuccess={getRoleList} />
        ) : (
          ''
        )}
        {deleteOpen ? (
          <DeleteDialogPopUp
            onClose={handleDeleteClose}
            onDelete={() => deleteCustomer(selectedData.id)}
          />
        ) : (
          ''
        )}
        <Card>
          <RoleListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />


          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <RoleListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={roleList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, accessLevel, email, password, description, createdAt } = row;
                  const selectedUser = selected.indexOf(email) !== -1;

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, email)} />
                      </TableCell>

                      {/* <TableCell align="left">{id}</TableCell> */}

                      <TableCell align="left">{accessLevel}</TableCell>

                      {/* <TableCell align="left">{email}</TableCell> */}

                      {/* <TableCell align="left">{password}</TableCell> */}

                      <TableCell align="left">{description}</TableCell>


                      {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                      <TableCell align="right">
                        <RoleMoreMenu
                          onEditClick={() => openAddEditPopUp(row) }
                          onDelete={() => openDeletePopUp(row)}
                        />
                      </TableCell>

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
            count={roleList.length}
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
        <MenuItem
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
  
        <MenuItem sx={{ color: 'error.main' }}
       >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover> */}
    </>
  );
}

