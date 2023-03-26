import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Checkbox
} from '@mui/material';
import { AddEditCountryPopUp, CountryListHead } from '../sections/@dashboard/others/country';
import DeleteDialogPopUp from '../components/DialogPopUp';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { Constant } from '../utils/Constant';

// ----------------------------------------------------------------------
const PERMISSIONLIST = [
  {
    id: 1,
    path: Constant.LIBRARY,
    name: 'Library',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 2,
    path: Constant.PITCHTRACKER,
    name: 'Pitch Tracker',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 3,
    path: Constant.OUTBOUNDS,
    name: 'Outbounds',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 4,
    path: Constant.USER,
    name: 'User',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 5,
    path: Constant.ROLE,
    name: 'Role',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 6,
    path: Constant.LANGUAGE,
    name: 'Language',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 7,
    path: Constant.PLATFORM,
    name: 'Platform',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 8,
    path: Constant.GENRE,
    name: 'Genre',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 9,
    path: Constant.TERRITORY,
    name: 'Territory',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 10,
    path: Constant.RATINGS,
    name: 'Ratings',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 11,
    path: Constant.FORMAT,
    name: 'Format',
    readBool: false,
    updateBool: false,
    deletBoole: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 12,
    path: Constant.STUDIO,
    name: 'Studio',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 13,
    path: Constant.COUNTRY,
    name: 'Country',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 14,
    path: Constant.RIGHTS,
    name: 'Rights',
    readBool: false,
    updateBool: false,
    deleteBool: false,
    createdAt: '',
    updatedAt: ''
  }
];

const TABLE_HEAD = [
  { id: 'resource', label: 'Resource', alignRight: false, isSort: false },
  { id: 'createBool', label: 'Create', alignRight: false, isSort: false },
  { id: 'deleteBool', label: 'Delete', alignRight: false, isSort: false },
  { id: 'updateBool', label: 'Update', alignRight: false, isSort: false },
  { id: 'createdAt', label: 'Created At', alignRight: false, isSort: false },
  { id: 'updatedAt', label: 'Updated At', alignRight: false, isSort: false }
];

// ----------------------------------------------------------------------

export default function Permission(props) {
  const { roleId } = props;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [searchBy, setSearchBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [country, setCountry] = useState();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const openAddEditPopUp = (data) => {
    setOpen((open) => (open = !open));
    setCountry(data);
  };

  const openDeletePopUp = () => {
    setDeleteOpen((deleteOpen) => (deleteOpen = !deleteOpen));
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PERMISSIONLIST.length) : 0;

  return (
    <Page title="Permission">
      <Container>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CountryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={PERMISSIONLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {PERMISSIONLIST.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                    (row) => {
                      const { id, name, createBool, deleteBool, updateBool, createdAt, updatedAt } =
                        row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell component="th" scope="row" padding="normal">
                            {name}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            <Checkbox checked={createBool} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            <Checkbox checked={deleteBool} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            <Checkbox checked={updateBool} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {createdAt}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="normal">
                            {updatedAt}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={PERMISSIONLIST.length}
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
