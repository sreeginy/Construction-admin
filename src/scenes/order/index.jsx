import { Link as RouterLink } from 'react-router-dom';
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
import SearchNotFound from '../../components/SearchNotFound';
import AddOrder from '../../sections/@dashboard/order/AddOrder';
import { ToastContainer } from 'react-toastify';

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

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// // mock
// import USERLIST from '../../_mock/order';

import {
  AddEditOrderPopUp,
  OrderListHead,
  OrderListToolbar,
  OrderMoreMenu,
  FullViewOrder,
  ImageUpload,

} from '../../sections/@dashboard/order';

import ChangeStatus from '../../sections/@dashboard/order/ChangeStatus';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Order ID', alignRight: false },
  { id: 'customerName', label: 'Customer Name', alignRight: false },
  { id: 'deliveryPartnerName', label: 'Delivery Partner', alignRight: false },
  { id: 'products', label: 'Products', alignRight: false },
  { id: 'orderStatus', label: 'Order Status', alignRight: false },
  { id: 'deliveryDate', label: 'Delivery Date', alignRight: false },
  { id: 'deliveryAddress', label: 'Delivery Address', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false },
  { id: '' },
  { id: 'createdAt', label: 'Created_At', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function Order() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('customerName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState();
  const [SelectedOrderId, setSelectedOrderId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [orderList, setOrderList] = useState([]);
  const [orders, setOrders] = useState();
  const [openImport, setOpenImport] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState({});
  const [openExport, setOpenExport] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedData, setselectedData] = useState();

  const [libraryList, setLibraryList] = useState([]);



  const openAddEditPopUp = (data) => {
    setOpen((open) => (open = !open));
    setSelectedOrderData(data);
  };

  const openEditPopUp = (data) => {
    setEditOpen((editOpen) => (editOpen = !editOpen));
    setSelectedOrderData(data);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  
  const handleOpenEdit = (data) => {
    // setOrders(data);
    // setOpenEdit(true);

    setOpen((open) => (open = !open));
    setselectedData(data);
  };

  const handleCloseEdit = () => {
    setOrders();
    setOpenEdit(false);
  };

  const openDeletePopUp = (data) => {
    setOrders(data);
    setDeleteOpen((deleteOpen) => (deleteOpen = !deleteOpen));
  };


  const handleAddClose = () => {
    setOpenAdd(false);
   
  };

  const openViewPopUp = (data) => {
    setViewOpen((viewOpen) => (viewOpen = !viewOpen));
    setOrders(data);
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleImportClose = () => {
    setOpenImport(false);
  };

  const handleImageClose = () => {
    setOpenImage(false);
  };

  /* API Import Library */
  const importLibraryList = async (file) => {
    const data = new FormData();
    data.append('library_csv', file);
    try {
      const response = await apiClient.post('libraryimport', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
        }
      });
      if (response.status === 201) {
        handleImportClose();
        getOrderList();
        notifySuccess(response.statusText);
      } else {
        apiHandleError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderList.map((n) => n.customerName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, customerName) => {
    const selectedIndex = selected.indexOf(customerName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, customerName);
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
    // setPermission(getPermission(Constant.LIBRARY));
    // setIsLoading(true);
    getOrderList();
  }, []);

  /* API GET ALL Library */
  const getOrderList = async () => {
    try {
      const response = await apiClient.get('orders/all', {
        headers: headers()
      });
      if (response.status === 200) {
        console.log(response.data.data);
        setOrderList(response.data.data);
        setIsLoading(false);
      } else {
        apiHandleError(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* API Delete Country */
  const deleteLibrary = async (id) => {
    try {
      const response = await apiClient.delete(`library/${id}`, {
        headers: headers()
      });
      if (response.status === 200) {
        notifySuccess(response.statusText);
        handleDeleteClose();
        getOrderList();
      } else {
        apiHandleError(response);
      }
      console.log('delete', response);
    } catch (error) {
      console.log(error);
    }
  };



  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;
  const filteredUsers = applySortFilter(orderList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyFail = (msg) => toast.error(msg, messageStyle);
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <>


      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom >
            ORDER &nbsp; LIST
          </Typography>
          {true && (
          <Button
            // color="info" 
            variant="contained"
            component={RouterLink}
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenAdd}

          >
            Create Order
          </Button>

)}
        </Stack>

        {openAdd ? (
          <AddOrder onClose={handleAddClose} data={orders} onSuccess={getOrderList} />
        ) : (
          ''
        )}
         {openEdit ? (
          <ChangeStatus onClose={handleCloseEdit} data={selectedData} onSuccess={getOrderList}  />
        ) : (
          ''
        )}
    
        {deleteOpen ? (
          <DeleteDialogPopUp
            onClose={handleDeleteClose}
            onDelete={() => deleteLibrary(selectedData.id)}
          />
        ) : (
          ''
        )}
       
        {viewOpen ? <FullViewOrder onClose={handleViewClose} data={orders} /> : ''}

        {/* {deleteOpen ? (
          <DeleteDialogPopUp onDelete={handleDelete} onClose={handleDeleteClose} />
        ) : (
          ''
        )} */}
        <Card>
          <OrderListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />


          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <OrderListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={orderList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, customerName, deliveryPartnerName, products, orderStatus, deliveryDate, deliveryAddress, createdAt, customer, partners, product } = row;
                  const selectedUser = selected.indexOf(customerName) !== -1;
                  const isItemSelected = selected.indexOf(id) !== -1;
                  let total = 0;
                  product.map((row) => (total += row.total));
                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, customerName)} />
                      </TableCell>

                      <TableCell align="left">{id}</TableCell>
                            <TableCell align="left">
                              {`${customer.firstName} ${customer.lastName}`}
                            </TableCell>
                            <TableCell align="left">{partners.name}</TableCell>
                            <TableCell align="left">
                              {product.map(
                                (row) => `${row.product.productName} X ${`${row.quantity} `}`
                              )}
                            </TableCell>
                            <TableCell align="left">{orderStatus.toString()}</TableCell>
                            <TableCell align="left">
                              {moment(createdAt, Constant.LISTDATEFORMAT)
                                .add(partners.duration, 'days')
                                .format(Constant.DATEONLYFORMAT)}
                            </TableCell>
                            <TableCell align="left">{customer.deliveryAddress}</TableCell>
                            <TableCell align="left">{total}</TableCell>

                      <TableCell align="right">
                        {/* <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton> */}

                        <OrderMoreMenu
                                permission={permission}
                                onEditClick={() => handleOpenEdit(row)}
                                onDelete={() => openDeletePopUp(row)}
                                onViewClick={() => openViewPopUp(row)}
                              />
                      </TableCell>

                      <TableCell align="left">{createdAt ? moment(deliveryDate).format(Constant.LISTDATEFORMAT) : ''}</TableCell>
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
                        <TableCell align="center" colSpan={11} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
       
            </Table>
          </TableContainer>


          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orderList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ToastContainer/>

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


