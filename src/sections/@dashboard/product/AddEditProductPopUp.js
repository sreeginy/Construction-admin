
import { CalendarMonth, Edit, Flag, Password } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  Tabs,
  TextField,
  useTheme,
  Autocomplete,
  InputAdornment,
  IconButton
} from '@mui/material';
import moment from 'moment';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Header from "../../../components/Header";

import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
// Api Call
import { toast } from 'react-toastify';
import apiClient from '../../../api/apiClient';
import headers from '../../../api/apiHeader';

import messageStyle from '../../../components/toast/toastStyle';
import apiHandleError from '../../../api/apiHandleError';

// component
import Iconify from '../../../components/iconify';

// validation
AddEditOutgoingPopUp.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
  title: PropTypes.string
};

export default function AddEditOutgoingPopUp(props) {
  const { data, onClose, onSuccess } = props;
  const [statusId, setStatusId] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const [partnersData, setPartnersData] = React.useState({
    name: data.name,
    cost: data.cost,
    duration: data.duration
  });

  const setDropDownValue = (value) => {
    setStatusId(value);
  };
  // Validations
  const AddSchema = Yup.object().shape({
    productNo: Yup.string().required("Product number is required"),
    productName: Yup.string().required("Product name is required"),
    productType: Yup.string().required("Product type is required"),
    price: Yup.string().required("Product price is required"),
    quantity: Yup.string().required("Product quantity is required"),
    productStatus: Yup.string().required("Product status is required"),
  });

  const formik = useFormik({
    initialValues: {
      productNo: data.productNo,
      productName: data.productName,
      productType: data.productType,
      price: data.price,
      quantity: data.quantity,
      productStatus: data.productStatus,
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewProduct();
    }
  });

  const rawData = {
    productNo: formik.values.productNo,
    productName: formik.values.productName,
    productType: formik.values.productType,
    price: formik.values.price,
    quantity: formik.values.quantity,
    productStatus: formik.values.productStatus,
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const addNewProduct = async () => {
    try {
      
      const response = await apiClient.post('product/add', rawData, {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          onSuccess();
          onClose();
        } else {
          formik.isSubmitting = false
          notifyError(response.data.message);
        }
      } else {
        formik.isSubmitting = false
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Update customer Api
  const updateProduct = async (id) => {
    try {
      const response = await apiClient.post(`product/update/${id}`, rawData, {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
        onSuccess();
        onClose();
        } else {
          notifyError(response.data.message);
        }
      
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"  pt={3} >
          {data.productName !== '' ? 'Edit Product' : 'Add Product'}
          <Header
            subtitle="Create a New Product"
          />
        </DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
              <Box sx={({ pb: 3 }, { pt: 0 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Product No"
                    {...getFieldProps('productNo')}
                    error={Boolean(touched.productNo && errors.productNo)}
                    helperText={touched.productNo && errors.productNo}
                  />
                </Box>

                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Product Name"
                    {...getFieldProps('productName')}
                    error={Boolean(touched.productName && errors.productName)}
                    helperText={touched.productName && errors.productName}
                  />
                </Box>
               
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.productType && errors.productType)}
                    >
                      Product Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="productType"
                      label="productType"
                      defaultValue=""
                      {...getFieldProps('productType')}
                      error={Boolean(touched.productType && errors.productType)}
                    >
                      <MenuItem
                        key={0}
                        value={'Cement' ?? ''}
                        onClick={() => setDropDownValue('Cement')}
                      >
                        Cement
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'Soil' ?? ''}
                        onClick={() => setDropDownValue('Soil')}
                      >
                        Soil
                      </MenuItem>
                     
                    </Select>
                    <FormHelperText error={Boolean(touched.productType && errors.productType)}>
                      {touched.productType && errors.productType}
                    </FormHelperText>
                  </FormControl>
                  
                </Box>
               
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Price"
                    {...getFieldProps('price')}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Quantity"
                    {...getFieldProps('quantity')}
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                  />
                </Box>
               
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                
                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-simple-select-label"
                        error={Boolean(touched.productStatus && errors.productStatus)}
                      >
                        Product status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Product Status"
                        defaultValue=""
                        {...getFieldProps('productStatus')}
                        error={Boolean(touched.productStatus && errors.productStatus)}
                      >
                        <MenuItem key={0} value="Active" onClick={() => setDropDownValue('Active')}>
                          Active
                        </MenuItem>
                        <MenuItem key={1} value="Banned" onClick={() => setDropDownValue('Banned')}>
                          Banned
                        </MenuItem>
                      </Select>
                      <FormHelperText error={Boolean(touched.productStatus && errors.productStatus)}>
                        {touched.productStatus && errors.productStatus}
                      </FormHelperText>
                    </FormControl>
                 
                </Box>
                
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.productName !== '' ? (
                <LoadingButton
                  onClick={() => updateProduct(data?.id)}
                  size="medium"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save
                </LoadingButton>
              ) : (
                <LoadingButton
                  size="medium"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Create
                </LoadingButton>
              )}
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}