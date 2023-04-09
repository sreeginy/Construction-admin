
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import DeleteDialogPopUp from '../../components/DialogPopUp';
import Iconify from '../../components/iconify';
import Page from '../../components/Page';


import SortDropDown from '../../components/SortDropDown';

// components



import {
  AddEditCustomerPopUp,
  CustomerListHead,
  CustomerListToolbar,
  CustomerMoreMenu,
} from '../../sections/@dashboard/customer';

import USERLIST from '../../_mock/project';

// Api Call
import apiClient from '../../api/apiClient';
import headers from '../../api/apiHeader';
import apiHandleError from '../../api/apiHandleError';

import messageStyle from '../../components/toast/toastStyle';

import { Constant } from '../../utils/Constant';
import { getPermission } from '../../utils/PermissionUtil';

// ----------------------------------------------------------------------
const SORT_OPTIONS = [
  { value: 'firstname', label: 'First Name' },
  { value: 'lastname', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'address', label: 'Address' },
  { value: 'deliveryAddress', label: 'Delivery Address' },
  { value: 'contactNo', label: 'Contact No' }
];

const TABLE_HEAD = [
  // { id: 'guid', label: 'Guid', alignRight: false, isSort: true },
  { id: 'first_name', label: 'First Name', alignRight: false, isSort: true },
  // { id: 'platform', label: 'Platform', alignRight: false, isSort: true },
  // { id: 'launchDate', label: 'Launch Date', alignRight: false, isSort: true },
  // { id: 'deliveryDate', label: 'delivery Date', alignRight: false, isSort: true },
  { id: 'last_name', label: 'Last Name', alignRight: false, isSort: true },
  { id: 'email', label: 'Email', alignRight: false, isSort: true },
  { id: 'address', label: 'Address', alignRight: false, isSort: true },
  { id: 'delivery_address', label: 'Delivery Address', alignRight: false, isSort: true },
  { id: 'contact_no', label: 'Contact No', alignRight: false, isSort: true },
  { id: 'createdAt', label: 'Created At', alignRight: false, isSort: true },
  { id: 'action', label: 'Action', alignRight: false, isSort: false }
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
function applyFilters(array, filterObj) {
  // let filterData = array;
  // filterData = filter(
  //   filterData,
  //   (_outbound) => _outbound.Customer_Name.toLowerCase().indexOf(filterObj?.Customer_Name.toLowerCase()) !== -1
  // );
  // filterData = filter(
  //   filterData,
  //   (_outbound) =>
  //     _outbound?.Username?.toLowerCase()
  //       .indexOf(filterObj?.Username?.toLowerCase()) !== -1
  // );
  // filterData = filter(
  //   filterData,
  //   (_outbound) =>
  //     _outbound?.territories
  //       .map((territory) => territory.region)
  //       ?.toString()
  //       ?.toLowerCase()
  //       .indexOf(filterObj?.territory?.toLowerCase()) !== -1
  // );
  // filterData = filter(
  //   filterData,
  //   (_outbound) =>
  //     _outbound.launchDate?.toLowerCase().indexOf(filterObj?.launchDate?.toLowerCase()) !== -1
  // );
  // filterData = filter(
  //   filterData,
  //   (_outbound) =>
  //     _outbound.deliveryDate?.toLowerCase().indexOf(filterObj?.deliveryDate.toLowerCase()) !== -1
  // );
  // return filterData;
}

const initialFilters = {
  title: '',
  platform: '',
  territory: '',
  launchDate: '',
  deliveryDate: ''
};

function applySortFilter(array, comparator, query, filterBy) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query && filterBy === 'firstname') {
    return filter(
      array,
      (_customer) => _customer?.firstName?.toLowerCase()?.indexOf(query.toLowerCase()) !== -1
    );
  }
  if (query && filterBy === 'lastname') {
    return filter(
      array,
      (_customer) =>
      _customer?.lastName?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  if (query && filterBy === 'email') {
    return filter(
      array,
      (_customer) =>
      _customer?.email?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  if (query && filterBy === 'address') {
    return filter(
      array,
      (_customer) => _customer.address.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  if (query && filterBy === 'deliveryAddress') {
    return filter(
      array,
      (_customer) =>
      _customer.deliveryAddress?.toLowerCase()?.indexOf(query.toLowerCase()) !== -1
    );
  }
  if (query && filterBy === 'contactNo') {
    return filter(
      array,
      (_customer) =>
      _customer.contactNo?.toString().toLowerCase()?.indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Customers() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('firstname');
  const [searchBy, setSearchBy] = useState('firstname');
  const [filterName, setFilterName] = useState('');
  const [filters, setfilters] = useState(initialFilters);
  const [openFilter, setOpenFilter] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedData, setselectedData] = useState();
  const [outBoundList, setOutboundList] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const openAddEditPopUp = (data) => {
    setOpen((open) => (open = !open));
    setselectedData(data);
  };

  const openEditPopUp = (data) => {
    setEditOpen((editOpen) => (editOpen = !editOpen));
    setselectedData(data);
  };
  const openDeletePopUp = (data) => {
    setDeleteOpen((deleteOpen) => (deleteOpen = !deleteOpen));
    setselectedData(data);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleClose = () => {
    console.log("close");
    setOpen(false);
  };
  const handleFilterData = (data) => {
    setfilters(data);
    console.log(data);
  };

  const handleSearchBy = (v) => {
    setSearchBy(v);
  };
  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

  useEffect(() => {
    // setPermission(getPermission(Constant.OUTBOUNDS));
    getCustomerList();
  }, []);

  const getCustomerList = async () => {
    try {
      const response = await apiClient.get('customers/all', {
        headers: headers()
      });
      if (response.status === 200) {
        if (response.data.status === 1000) {
          setOutboundList(response.data.data);
        }
        // setOutboundList(response.data);
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  /* API Delete outbound */
  const deleteCustomer = async (id) => {
    try {
      const response = await apiClient.get(`customers/delete/${id}`, {
        headers: headers()
      });
      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          handleDeleteClose();
          getCustomerList();
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenExport = () => {
    setOpenExport(true);
  };
  const handleExportClose = () => {
    setOpenExport(false);
  };
  const handleFilterClose = () => {
    setOpenFilter(false);
  };
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleClearFilters = () => {
    setfilters(initialFilters);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - outBoundList.length) : 0;

  const filteredData = applyFilters(outBoundList, filters);

  const filteredFormat = applySortFilter(
    outBoundList,
    getComparator(order, orderBy),
    filterName,
    searchBy
  );
  // const filteredFormat =
  //   outBoundList?.length > 0
  //     ? applySortFilter(outBoundList, getComparator(order, orderBy), filterName, searchBy)
  //     : [];

  const isUserNotFound = USERLIST.length === 0;

  return (
    <Page title="Customers">
      <Container maxWidth="xl">
        <Box sx={{ pb: 3 }}>
          <Typography variant="h4">Customers</Typography>
        </Box>
        <Stack direction="row" mb={2} alignItems="end" justifyContent="end">
          {true && (
            <Button
              variant="contained"
              endIcon={<Iconify icon="carbon:add-filled" />}
              onClick={() =>
                openAddEditPopUp({
                  firstName: '',
                  lastName: '',
                  email: '',
                  address: '',
                  deliveryAddress: '',
                  contactNo: '',
                  password: ''
                })
              }
            >
              Add Customers
            </Button>
          )}
        </Stack>
        {/* {openFilter ? (
          <FilterPopUp onClose={handleFilterClose} onApply={(obj) => handleFilterData(obj)} />
        ) : (
          ''
        )}
        {openExport ? <Export onClose={handleExportClose} /> : ''} */}
        {open ? (
          <AddEditCustomerPopUp
            onClose={handleClose}
            data={selectedData}
            onSuccess={getCustomerList}
          />
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
          <Stack direction="row" alignItems="center" mx={2}>
            <SortDropDown options={SORT_OPTIONS} onSort={(v) => handleSearchBy(v)} />
            {/* <DataSearchBar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              placeholder="Search"
            /> */}
          </Stack>

            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CustomerListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredFormat
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        firstName,
                        lastName,
                        email,
                        address,
                        deliveryAddress,
                        contactNo,
                        password,
                        createdAt
                      } = row;
                      // const isItemSelected = selected.indexOf(customerName) !== -1;
                      const showTerritories = [];
                      const getSelectedTerritories = [];
                      // eslint-disable-next-line array-callback-return

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          // selected={isItemSelected}
                          // aria-checked={isItemSelected}
                        >
                          {/* <TableCell component="th" scope="row" padding="normal">
                            {_id}
                          </TableCell> */}
                          <TableCell component="th" scope="row" padding="normal">
                            {firstName}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {/* {showTerritories.join(',')} */}
                            {lastName}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {email}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {address}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {deliveryAddress}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {contactNo}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {createdAt}
                          </TableCell>
                          <TableCell align="left">
                            <CustomerMoreMenu
                              onEditClick={() =>
                                openAddEditPopUp(row)
                              }
                              onDelete={() => openDeletePopUp(row)}
                            />
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
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        {/* <SearchNotFound searchQuery={filterName} /> */}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
     

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={outBoundList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
