
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

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


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
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required'),
    joinDate:Yup.string().required('Appointment date is required'),
    packages:Yup.string().required('PackageName is required'),
    status: Yup.string().required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      joinDate: '',
      packages: data.packages,
      status: data.status,
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewAppointment ();
    }
  });

  const rawData = {
    firstName: formik.values.firstName,
    lastName: formik.values.lastName,
    email: formik.values.email,
    joinDate: formik.values.joinDate,
    packages: formik.values.packages,
    status: formik.values.status,
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps,setFieldValue  } = formik;

  const addNewAppointment  = async () => {
    try {
      
      const response = await apiClient.post('appointment/add', rawData, {
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
  const updateAppointment  = async (id) => {
    try {
      const response = await apiClient.post(`appointment/update/${id}`, rawData, {
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
          {data.firstName !== '' ? 'Edit Appointment' : 'Add Appointment'}
          <Header
            subtitle="Create a New Appointment"
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
                    label="Email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                <FormControl fullWidth>
                <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Join Date"
                    inputFormat="yyyy-MM-dd"
                    {...getFieldProps('joinDate')}
                    error={Boolean(touched.joinDate && errors.joinDate)}
                    helperText={touched.joinDate && errors.joinDate}
                    onChange={(value) => {
                      setFieldValue('joinDate', value);
                    }}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
                </FormControl>
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.packages && errors.packages)}
                    >
                      Material  Packages
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="packages"
                      label="packages"
                      defaultValue=""
                      {...getFieldProps('packages')}
                      error={Boolean(touched.packages && errors.packages)}
                    >
                      <MenuItem
                        key={0}
                        value={'ESSENTIAL' ?? ''}
                        onClick={() => setDropDownValue('ESSENTIAL')}
                      >
                        ESSENTIAL
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'PREMIUM' ?? ''}
                        onClick={() => setDropDownValue('PREMIUM')}
                      >
                        PREMIUM
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'LUXURIOUS' ?? ''}
                        onClick={() => setDropDownValue('LUXURIOUS')}
                      >
                        LUXURIOUS
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'THE ONE' ?? ''}
                        onClick={() => setDropDownValue('THE ONE')}
                      >
                        THE ONE
                      </MenuItem>

                    </Select>
                    <FormHelperText error={Boolean(touched.packages && errors.packages)}>
                      {touched.packages && errors.packages}
                    </FormHelperText>
                  </FormControl>
                </Box>

               <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.status && errors.status)}
                    >
                      Appointment status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Appointment Status"
                      defaultValue=""
                      {...getFieldProps('status')}
                      error={Boolean(touched.status && errors.status)}
                    >
                      <MenuItem key={0} value="Pending" onClick={() => setDropDownValue('Pending')}>
                        Pending
                      </MenuItem>
                      <MenuItem key={1} value="Proceed" onClick={() => setDropDownValue('Proceed')}>
                        Proceed
                      </MenuItem>
                    </Select>
                    <FormHelperText error={Boolean(touched.status && errors.status)}>
                      {touched.status && errors.status}
                    </FormHelperText>
                  </FormControl>
                </Box>
               
                
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.firstName !== '' ? (
                <LoadingButton
                  onClick={() => updateAppointment (data?.id)}
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