import { Box, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteDialogPopUp from '../../../components/DialogPopUp';
import messageStyle from '../../../components/toast/toastStyle';
import Page from '../../../components/Page';


import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

// @mui
import {
    Card,
    Table,
    TableRow,
    TableBody,
    TableCell,
    Container,
    TableContainer,
    TablePagination,
    MenuItem,
    ListItemIcon
} from '@mui/material';

import Iconify from '../../../components/iconify';

// mock
import { positions } from "@mui/system";


import {  TerritoryListHead } from '../others/territory';

// ----------------------------------------------------------------------
const placeholder = '/static/placeholder.jpg';
const TABLE_HEAD = [
    { id: 'products', label: 'Product', alignRight: false, isSort: false },
    { id: 'quantity', label: 'Quantity', alignRight: false, isSort: false },
    { id: 'price', label: 'Price', alignRight: false, isSort: false },
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
// validation
AlternateLanguage.propTypes = {
    data: PropTypes.array,
    onDelete: PropTypes.func
  };

export default function AlternateLanguage(props) {
    const { data, onDelete } = props;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState();
  const [SelectedEmployeeId, setSelectedEmployeeId] = useState('');


  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [languge, setLanguage] = useState();
  const [orderList, setOrderList] = useState(data);


  const openAddEditPopUp = (data) => {
  setOpen((open) => (open = !open));
  setSelectedEmployeeData(data);
  };

  const openEditPopUp = (data) => {
    setEditOpen((editOpen) => (editOpen = !editOpen));
    setSelectedEmployeeData(data);
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
      const newSelecteds = orderList.map((n) => n.name);
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
    // setPermission(getPermission(Constant.EMPLOYEEPAGE));
    // setIsLoading(true);
    // getProjectList();
  }, []);


 


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  const filteredUsers = applySortFilter(orderList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyFail = (msg) => toast.error(msg, messageStyle);


  return (
    <>

<Page title="Add Order">
      <Container  maxWidth="xl">
        <Card>
   
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TerritoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orderList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                {orderList
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { products, quantity, total } = row;
                      const isItemSelected = selected.indexOf(orderList) !== -1;

                    return (
                        <TableRow
                        hover
                        key={index}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell component="th" scope="row" padding="normal">
                          {products.productName}
                        </TableCell>
                        <TableCell align="left" padding="normal">
                          {quantity}
                        </TableCell>
                        <TableCell align="left" padding="normal">
                          {total}
                        </TableCell>
                        <TableCell align="left">
                          <ListItemIcon onClick={() => onDelete(index)}>
                            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
                          </ListItemIcon>

                          {/* <UserMoreMenu onDelete={openDeletePopUp} /> */}
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
               
              </Table>
            </TableContainer>
  

            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orderList?.length > 0 ? orderList?.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {deleteOpen ? <DeleteDialogPopUp onClose={handleDeleteClose} /> : ''}
      </Container>
        

</Page>
    </>
  );
}


