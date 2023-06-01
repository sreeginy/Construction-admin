
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [partnersData, setPartnersData] = React.useState({
    name: data.name,
    cost: data.cost,
    duration: data.duration
  });

  // Validations
  const AddSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    address: Yup.string().required('Address is required'),
    deliveryAddress: Yup.string().required('Delivery Address is required'),
    email: Yup.string().required('Email is required'),
    password:Yup.string().required('password is required'),
    contactNo:Yup.number("Contact number must be number").required('Contact no is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      deliveryAddress: data.deliveryAddress,
      email: data.email,
      password: '',
      contactNo: data.contactNo,
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewCustomer();
    }
  });

  const rawData = {
    firstName: formik.values.firstName,
    lastName: formik.values.lastName,
    address: formik.values.address,
    deliveryAddress: formik.values.deliveryAddress,
    email: formik.values.email,
    password: formik.values.password,
    contactNo: formik.values.contactNo,
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const addNewCustomer = async () => {
    try {
      
      const response = await apiClient.post('customers/add', rawData, {
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
  const updateCustomer = async (id) => {
    try {
      const response = await apiClient.post(`customers/update/${id}`, rawData, {
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
          {data.firstName !== '' ? 'Edit Customer' : 'Add Customer'}
          <Header
            subtitle="Create a New Customers"
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
                    label="First Name"
                    {...getFieldProps('firstName')}
                    error={Boolean(touched.firstName && errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Last Name"
                    {...getFieldProps('lastName')}
                    error={Boolean(touched.lastName && errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Delivery Address"
                    {...getFieldProps('deliveryAddress')}
                    error={Boolean(touched.deliveryAddress && errors.deliveryAddress)}
                    helperText={touched.deliveryAddress && errors.deliveryAddress}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box>
                {data.firstName !== '' ? ' ' : <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    {...getFieldProps('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Box>}
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    type="number"
                    id="outlined-basic"
                    label="Contact No"
                    {...getFieldProps('contactNo')}
                    error={Boolean(touched.contactNo && errors.contactNo)}
                    helperText={touched.contactNo && errors.contactNo}
                  />
                </Box>
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.firstName !== '' ? (
                <LoadingButton
                  onClick={() => updateCustomer(data?.id)}
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