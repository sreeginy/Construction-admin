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

// Api Call
import apiClient from '../../api/apiClient';
import headers from '../../api/apiHeader';
import apiHandleError from '../../api/apiHandleError';

import {
  AddEditProjectPopUp,
  ProjectListHead,
  ProjectListToolbar,
  ProjectMoreMenu,
} from '../../sections/@dashboard/project';

import { MoreMenu } from '../../sections/@dashboard/user/user'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  
  { id: 'projectName', label: 'Project Name', alignRight: false },
  { id: 'packages', label: 'Material Type', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'location', label: 'Location ', alignRight: false },
  { id: 'clientName', label: 'client Name', alignRight: false },
  { id: 'projectSqft', label: 'Square Fit', alignRight: false },
  { id: 'projectRoom', label: 'Rooms', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
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
    return filter(array, (_user) => _user.ProjectName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function Customer() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('projectName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState();
  const [SelectedCustomerId, setSelectedCustomerId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);


  const [projectList, setProjectList] = useState([]);
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
      const newSelecteds = projectList.map((n) => n.projectName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, projectName) => {
    const selectedIndex = selected.indexOf(projectName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, projectName);
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
    getProjectList();
  }, []);


  const getProjectList = async () => {
    try {
      const response = await apiClient.get('project/all', {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          setProjectList(response.data.data);
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
    getProjectList();
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await apiClient.delete(`project/delete/${id}`, {
        headers: headers()
      });
      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          handleDeleteClose();
          getProjectList();
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


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projectList.length) : 0;

  const filteredUsers = applySortFilter(projectList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  // const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyFail = (msg) => toast.error(msg, messageStyle);


  return (
    <>


      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom >
          PROJECT &nbsp; DETAILS
          </Typography>
          {/* <Typography  alignItems="center">Get clear ideas of what raw materials to be used to your home!</Typography>  */}
          {/* {permission?.read && ( */}
          {true && (
            <Button
              // color="info" 
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() =>
                openAddEditPopUp({

                  projectName: '',
                  packages: '',
                  description: '',
                  duration: '',
                  location: '',
                  clientName: '',
                  projectSqft: '',
                  projectRoom: '',
                  status: '',
                })
              }
            >
              Add Portfolio
            </Button>
          )}
          {/* )}    */}
        </Stack>

        {open ? (
          <AddEditProjectPopUp onClose={handleClose} data={selectedData}
            onSuccess={getProjectList} />
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
          <ProjectListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />


          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ProjectListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={projectList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id,projectSqft,projectRoom, projectName, packages, description,duration,location,clientName,status, createdAt } = row;
                  const selectedUser = selected.indexOf(projectName) !== -1;

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, projectName)} />
                      </TableCell>

    
                      <TableCell align="left">{projectName}</TableCell>
                      <TableCell align="left">{packages}</TableCell>
                      <TableCell align="left">{description}</TableCell>
                      <TableCell align="left">{duration}</TableCell>
                      <TableCell align="left">{location}</TableCell>
                      <TableCell align="left">{clientName}</TableCell>
                      <TableCell align="left">{projectSqft}</TableCell>
                      <TableCell align="left">{projectRoom}</TableCell>

                      <TableCell align="left">
                        <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                      </TableCell>

                      <TableCell align="right">
                        <ProjectMoreMenu
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
            count={projectList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

