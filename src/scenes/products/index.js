
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';

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
import { getPermission } from '../../utils/PermissionUtil';

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import USERLIST from '../../_mock/product';
import { useState, UseEffect } from 'react';


import {
  AddEditProjectPopUp,
  ProjectListHead,
  ProjectMoreMenu,
  ProjectListToolbar
} from '../../sections/@dashboard/project';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'pro_id', label: 'Product ID', alignRight: false },
  { id: 'pro_name', label: 'Product Name', alignRight: false },
  { id: 'pro_type', label: 'Product Type', alignRight: false },
  { id: 'pro_description', label: 'Product Description', alignRight: false },
  { id: 'pro_item', label: 'Product Item', alignRight: false },
  { id: 'pro_status', label: 'Product Status', alignRight: false },
  { id: '' },
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

export default function UserPage() {
  

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('pro_name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProjectData, setSelectedProjectData] = useState();
  const [SelectedProjectId, setSelectedProjectId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState({});

  const openAddEditPopUp = (data) => {
  setOpen((open) => (open = !open));
  setSelectedProjectData(data);
  };
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  
  const handleClose = () => {
    setOpen(false);
   // getProjectList();


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.pro_name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  UseEffect(() => {
    setPermission(getPermission(Constant.PROJECTPAGE));
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

  return (
    <>


      <Container maxWidth="xl" >

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom >
           CEMENT &nbsp; PRODUCT
          </Typography>
          {/* <Typography  alignItems="center">Create a New User Profile</Typography> */}
          <Button 
          // color="info" 
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
           }
          >
            New Project
          </Button>

    
        </Stack>

        {open ? (
          <AddEditProjectPopUp onClose={handleClose} data={selectedProjectData} />
        ) : (
          ''
        )}
          {/* {deleteOpen ? (
          <DeleteDialogPopUp onDelete={handleDelete} onClose={handleDeleteClose} />
        ) : (
          ''
        )} */}
      
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
                    const { pro_id, pro_name, pro_type, pro_description, pro_item,pro_status, avatarUrl, isVerified } = row;
                    const selectedUser = selected.indexOf(pro_name) !== -1;

                    return (
                      <TableRow hover key={pro_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, pro_name)} />
                        </TableCell>

                        <TableCell align="left">{pro_id}</TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={pro_name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {pro_name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{pro_type}</TableCell>

                        <TableCell align="left">{pro_description}</TableCell>
                        <TableCell align="left">{pro_item}</TableCell>

                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}

                        <TableCell align="left">
                          <Label color={(pro_status === 'banned' && 'error') || 'success'}>{sentenceCase(pro_status)}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
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

      <Popover
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
      </Popover>
  

      </>
  );
}

}
