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
import USERLIST from '../../_mock/customer';


import {
  AddEditCustomerPopUp,
  CustomerListHead,
  CustomerListToolbar,
  CustomerMoreMenu
} from '../../sections/@dashboard/customer';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: 'Full Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'userEmail', label: 'E-mail', alignRight: false },
  { id: 'contact', label: 'Contact Number', alignRight: false },
  { id: '' },
  { id: 'createdAt', label: 'Created At', alignRight: false  },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// export default function Project() {

export default function Customer() {
 
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState();
  const [SelectedCustomerId, setSelectedCustomerId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState({});

  const openAddEditPopUp = (data) => {
  setOpen((open) => (open = !open));
  setSelectedCustomerData(data);
  };

  const openEditPopUp = (data) => {
    setEditOpen((editOpen) => (editOpen = !editOpen));
    setSelectedCustomerData(data);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
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
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleClose = () => {
    setOpen(false);
   // getProjectList();

  };

  useEffect(() => {
    setPermission(getPermission(Constant.CUSTOMERPAGE));
    setIsLoading(true);
    // getProjectList();
  }, []);

  const handleDelete = async () => {
    try {
      // const response = await apiClient.delete(`pitchtracker/${selectedPitchTrackerId}`, {
      //   headers: headers()
      // });
      // if (response.status === 200) {
      //   notifySuccess(response.statusText);
      //   setDeleteOpen(false);
      //   getPitchList();
      // } else {
      //   apiHandleError(response);
      // }
      // console.log(response);
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


      <Container  maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom >
            CUSTOMER &nbsp; LIST
          </Typography>
          {/* <Typography  alignItems="center">Create a New User Profile</Typography>  */}
           {/* {permission?.read && ( */}
          <Button 
          // color="info" 
          variant="contained" 
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => 
          openAddEditPopUp ({
              id: '',
              name: '',
              address: '',
              userEmail: '',
              contact: '',
             })
           }
          >
            Add New Customer
          </Button>

        {/* )}    */}
        </Stack>

        {open ? (
          <AddEditCustomerPopUp onClose={handleClose} data={selectedCustomerData} />
        ) : (
          ''
        )}
          {/* {deleteOpen ? (
          <DeleteDialogPopUp onDelete={handleDelete} onClose={handleDeleteClose} />
        ) : (
          ''
        )} */}
        <Card>
          <CustomerListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          

            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CustomerListHead
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
                    const { id, name, address, userEmail, contact, avatarUrl, isVerified, createdAt } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell align="left">{id}</TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{address}</TableCell>

                        <TableCell align="left">{userEmail}</TableCell>

                        <TableCell align="left">{contact}</TableCell>

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
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

