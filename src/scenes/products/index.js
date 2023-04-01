import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { toast } from 'react-toastify';
import moment from 'moment';

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
import messageStyle from '../../components/toast/toastStyle';
import DeleteDialogPopUp from '../../components/DialogPopUp';

import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import USERLIST from '../../_mock/product';
import { useState, useEffect } from 'react';
import { getPermission } from '../../utils/PermissionUtil';

import {
  AddEditProductPopUp,
  ProductListHead,
  ProductMoreMenu,
  ProductListToolbar,
  FullViewProducts,
  ImageUpload,
} from '../../sections/@dashboard/product';

// Api Call
import apiClient from '../../api/apiClient';
import headers from '../../api/apiHeader';
import apiHandleError from '../../api/apiHandleError';

const placeholder = '/static/placeholder.jpg';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Product No', alignRight: false },
  { id: 'avatarUrl', label: 'Product ', alignRight: false },
  { id: 'pro_name', label: ' Name', alignRight: false },
  { id: 'pro_type', label: 'Type', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'pro_item', label: ' Quantity', alignRight: false },
  { id: 'pro_status', label: ' Status', alignRight: false },
  { id: '' },
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


export default function Product() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('pro_name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState();
  const [SelectedProductId, setSelectedProductId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);


  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState({});
  const [product, setProduct] = useState();


  
  const handleImageClose = () => {
    setOpenImage(false);
  };

  const openAddEditPopUp = (data) => {
    setOpen((open) => (open = !open));
    setSelectedProductData(data);

  };

  const openEditPopUp = (data) => {
    setEditOpen((editOpen) => (editOpen = !editOpen));
    setSelectedProductData(data);
  };
  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleOpenEdit = (data) => {
    setProduct(data);
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
    setProduct();
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const openDeletePopUp = (data) => {
    setProduct(data);
    setDeleteOpen((deleteOpen) => (deleteOpen = !deleteOpen));
  };
  
  const openViewPopUp = (data) => {
    setViewOpen((viewOpen) => (viewOpen = !viewOpen));
    setProduct(data);
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

  const handleOpenImage = (data) => {
    setProduct(data);
    setOpenImage(true);
  };

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

  const handleClose = () => {
    setOpen(false);
    // getProjectList();

  };

  useEffect(() => {
    setPermission(getPermission(Constant.PRODUCT));
    setIsLoading(true);
    getProductList();
  }, []);

  const getProductList = async () => {
    try {
      const response = await apiClient.get('products', {
        headers: headers()
      });
      if (response.status === 200) {
        setProductList(response.data.products);
        setIsLoading(false);
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };


    /* API Delete Products */
    const deleteProduct = async (id) => {
      try {
        const response = await apiClient.delete(`product/${id}`, {
          headers: headers()
        });
        if (response.status === 200) {
          notifySuccess(response.statusText);
          handleDeleteClose();
          getProductList();
        } else {
          apiHandleError(response);
        }
        console.log('delete', response);
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

      <Container maxWidth="xl">
      {deleteOpen ? (
          <DeleteDialogPopUp
            onClose={handleDeleteClose}
            onDelete={() => deleteProduct(product._id)}
          />
        ) : (
          ''
        )}
        {openImage ? (
          <ImageUpload onClose={handleImageClose} data={product} onSuccess={getProductList} />
        ) : (
          ''
        )}
        {viewOpen ? <FullViewProducts onClose={handleViewClose} data={product} /> : ''}
    
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom >
            CONSTRUCTION &nbsp; YARD &nbsp; PRODUCTS
          </Typography>
          {/* <Typography  alignItems="center">Create a New User Profile</Typography>  */}
          {/* {permission?.read && ( */}
          <Button
            // color="info" 
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() =>
              openAddEditPopUp({
                id: '',
                avatarUrl: '',
                pro_name: '',
                pro_type: '',
                price: '',
                pro_item: '',
                pro_status: '',
              })
            }
          >
            Add Product
          </Button>

            {/*  )}    */}
        </Stack>

        {open ? (
          <AddEditProductPopUp onClose={handleClose} data={selectedProductData} />
        ) : (
          ''
        )}
        {/* {deleteOpen ? (
          <DeleteDialogPopUp onDelete={handleDelete} onClose={handleDeleteClose} />
        ) : (
          ''
        )} */}
        <Card>
          <ProductListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />


          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ProductListHead
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
                  const { id, pro_name, pro_type, price, pro_item, pro_status, avatarUrl, isVerified, createdAt } = row;
                  const selectedUser = selected.indexOf(pro_name) !== -1;

                  return (
                    <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, pro_name)} />
                      </TableCell>

                      <TableCell align="left">{id}</TableCell>

                      <TableCell align="left">
                        <img
                          width="80"
                          height="55"
                          srcSet={avatarUrl}
                          src={placeholder}
                          alt={avatarUrl}
                          loading="lazy"
                        />
                        {/* <Avatar
                                style={{ aspectRatio: 16 / 9 }}
                                alt="image"
                                variant="square"
                                src="/static/placeholder.jpg"
                              /> */}
                      </TableCell>


                      <TableCell align="left">{pro_name}</TableCell>

                      {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={pro_name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {pro_name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                      <TableCell align="left">{pro_type}</TableCell>
                      <TableCell align="left">{price}</TableCell>


                      <TableCell align="left">{pro_item}</TableCell>

                      {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}

                      <TableCell align="left">
                        <Label color={(pro_status === 'banned' && 'error') || 'success'}>{sentenceCase(pro_status)}</Label>
                      </TableCell>

                      <TableCell align="right">
                      <ProductMoreMenu
                                permission={permission}
                                onEditClick={() => handleOpenEdit(row)}
                                onDelete={() => openDeletePopUp(row)}
                                onViewClick={() => openViewPopUp(row)}
                                onImageClick={() => handleOpenImage(row)}
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


