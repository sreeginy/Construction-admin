import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  ButtonGroup,
  Button,
  TextField,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
  useTheme,
  Autocomplete,
  Dialog
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
// API
import { useEffect, useState } from 'react';
import apiClient from '../../../api/apiClient';
import headers from '../../../api/apiHeader';
import messageStyle from '../../../components/toast/toastStyle';
import apiHandleError from '../../../api/apiHandleError';
import AlternateLanguage from './AlternateTable';

// validation
AddOrder.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object
};

export default function AddOrder(props) {
  const { data, onClose, onSuccess } = props;
  const [customerList, SetCustomerList] = useState({ firstName: '', lastName: '' });
  const [partnerList, SetPartnerList] = useState({ name: '' });
  const [userList, setUserList] = useState({ firstName: '', lastName: '' });
  const [productList, setProductList] = useState({ productName: '' });
  const [orderList, setOrderList] = useState([]);
  const [quantity, setQuantity] = React.useState(5);

  useEffect(() => {
    getCustomerList();
    getPartnersList();
    getUsersList();
    getProductList();
  }, []);
  // Validations
  const AddSchema = Yup.object().shape({});

  const formik = useFormik({
    initialValues: {
      product: productList || { productName: '' },
      customer: customerList || { lastName: '' },
      deliveryPartner: partnerList || { name: '' }
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      createOrder(data);
      // addGenre(formik.values);
    }
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setSubmitting,
    resetForm
  } = formik;
  const handleDecrement = () => {
    if (quantity === 5) {
      setQuantity(quantity);
    } else {
      setQuantity(quantity - 5);
    }
  };
  

  const handleIncrement = () => {
    setQuantity((prevCount) => prevCount + 5);
  };

  const createOrder = async () => {
    const data = {
      product: orderList,
      customer: formik.values.customer,
      partners: formik.values.deliveryPartner,
      orderStatus: 'Pending'
    };

    try {
      const response = await apiClient.post('orders/add', data, {
        headers: headers()
      });
      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          onSuccess();
          onClose();
        } else {
          setSubmitting(false);
          notifyError(response.data.message);
        }
      } else {
        setSubmitting(false);
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      setSubmitting(false);
      console.log(error);
    }
  };

  const getProductList = async () => {
    try {
      const response = await apiClient.get('product/all', {
        headers: headers()
      });
      if (response.status === 200) {
        if (response.data.status === 1000) {
          setProductList(response.data.data);
        }
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomerList = async () => {
    try {
      const response = await apiClient.get('customers/all', {
        headers: headers()
      });
      if (response.status === 200) {
        if (response.data.status === 1000) {
          SetCustomerList(response.data.data);
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

  const getPartnersList = async () => {
    try {
      const response = await apiClient.get('partners/all', {
        headers: headers()
      });
      if (response.status === 200) {
        // setRatingList(response.data.rating);
        if (response.data.status === 1000) {
          SetPartnerList(response.data.data);
        }
      } else {
        apiHandleError(response);
      }
      console.log(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const getUsersList = async () => {
    try {
      const response = await apiClient.get('/user/all', {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          setUserList(response.data.data);
        }
        // setUserList(response.data);
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = (index) => {
    console.log(index);
    const array = orderList;
    array.splice(index, 1);
    setOrderList(array);
    resetForm();
    setQuantity(1);
  };

  const addProduct = () => {
    const rawData = {
      product: values.product,
      quantity,
      total: values.product.price * quantity
    };
    if (rawData.product !== '' && rawData.quantity !== '') {
      orderList.push(rawData);
      setOrderList(orderList);

      console.log(orderList);
      resetForm();
      setQuantity(1);
    } else {
      notifyError('Please fill all the fields');
    }
  };

  //   const setDropDownValue = (value) => {
  //     setCountryId(value);
  //   };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Create Order</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={({ pb: 3 }, { pt: 5 })}>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={5}>
                    <Box sx={({ pb: 3 }, { pt: 3 })}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="combo-box-demo"
                          disableClearable
                          options={productList}
                          {...getFieldProps('product')}
                          onChange={(event, newValue) => setFieldValue('product', newValue)}
                          getOptionLabel={(option) => option.productName}
                          renderInput={(params) => <TextField {...params} label="Products" />}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Box sx={({ pb: 3 }, { pt: 3 })}>
                      <ButtonGroup
                        variant="outlined"
                        aria-label="outlined button group"
                        size="large"
                      >
                        <Button variant="contained" onClick={handleDecrement} size="large">
                          -
                        </Button>
                        <Button>{quantity}</Button>
                        <Button variant="contained" onClick={handleIncrement} size="large">
                          +
                        </Button>

                        <Button variant="outlined" size="large" onClick={addProduct}>
                          Add Product
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={({ pb: 3 }, { pt: 3 })}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="combo-box-demo"
                          disableClearable
                          options={customerList}
                          {...getFieldProps('customer')}
                          onChange={(event, newValue) => setFieldValue('customer', newValue)}
                          getOptionLabel={(option) => option.lastName}
                          renderInput={(params) => <TextField {...params} label="Customer Name" />}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={({ pb: 3 }, { pt: 3 })}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="combo-box-demo"
                          disableClearable
                          options={partnerList}
                          {...getFieldProps('deliveryPartner')}
                          onChange={(event, newValue) => setFieldValue('deliveryPartner', newValue)}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField {...params} label="Delivery Partner" />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={({ pb: 3 }, { pt: 3 })}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="combo-box-demo"
                          disableClearable
                          options={userList}
                          {...getFieldProps('user')}
                          onChange={(event, newValue) => setFieldValue('user', newValue)}
                          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                          renderInput={(params) => <TextField {...params} label="Created By" />}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Grid item xs={6}>
              <Box sx={({ pb: 3 }, { pt: 5 })}>
                <AlternateLanguage  data={orderList} onDelete={(index) => deleteProduct(index)} />
              </Box>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={onClose}>
                Close
              </Button>
              <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}>
                Create
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
