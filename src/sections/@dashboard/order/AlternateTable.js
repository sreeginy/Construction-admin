import { filter } from 'lodash';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
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
// components
import { UserMoreMenu } from '../user';
import {  TerritoryListHead } from '../territory';
import DeleteDialogPopUp from '../../../components/DialogPopUp';
import Page from '../../../components/Page';
import Iconify from '../../../components/iconify';
import SearchNotFound from '../../../components/SearchNotFound';
//

// ----------------------------------------------------------------------
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'code', label: 'Code' }
];

const TABLE_HEAD = [
  { id: 'product', label: 'Product', alignRight: false, isSort: false },
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

function applySortFilter(array, comparator, query, filterBy) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query && filterBy === 'right') {
    return filter(
      array,
      (_language) => _language.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  if (query && filterBy === 'code') {
    return filter(
      array,
      (_language) => _language.code.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

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
  const [searchBy, setSearchBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [languge, setLanguage] = useState();
  const [orderList, setOrderList] = useState(data);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  return (
    <Page title="Add Order">
      <Container>
        <Card>
          {/* <Stack direction="row" alignItems="center" mx={2}>
            <SortDropDown options={SORT_OPTIONS} onSort={(v) => handleSearchBy(v)} />
            <DataSearchBar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              placeholder="Search"
            />
          </Stack> */}

            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TerritoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orderList?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {orderList
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { product, quantity, total } = row;
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
                            {product.productName}
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
  );
}
