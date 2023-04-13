
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

  // Validations
  const AddSchema = Yup.object().shape({
    workerName: Yup.string().required('Worker Name is required'),
    gender: Yup.string().required('gender is required'),
    contactNo:Yup.number("Contact number must be number").required('Contact no is required'),
    workDetail: Yup.string().required('work Detail is required'),
    joinDate: Yup.string().required('Join Date is required'),
    period:Yup.string().required('period is required'),
    payment:Yup.number("payment must be number").required('payment is required'),
    // total:Yup.number("total must be number").required('total is required'),
  });

  const formik = useFormik({
    initialValues: {
      workerName: data.workerName,
      gender: data.gender,
      contactNo: data.contactNo,
      workDetail: data.workDetail,
      joinDate: '',
      period: data.period,
      payment: data.payment,
      // total: data.total,
     
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewAccount();
    }
  });

  const rawData = {
    workerName: formik.values.workerName,
    gender: formik.values.gender,
    contactNo: formik.values.contactNo,
    workDetail: formik.values.workDetail,
    joinDate: formik.values.joinDate,
    period: formik.values.period,
    payment: formik.values.payment,
    // total: formik.values.total,
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue} = formik;


  const setDropDownValue = (value) => {
    setStatusId(value);
  };

  const addNewAccount = async () => {
    try {
      
      const response = await apiClient.post('account/add', rawData, {
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
  const updateAccount = async (id) => {
    try {
      const response = await apiClient.post(`account/update/${id}`, rawData, {
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
          {data.workerName !== '' ? 'Edit Account' : 'Add Account'}
          <Header
            subtitle="Create a New Workers Details"
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
                    label="Worker Name"
                    {...getFieldProps('workerName')}
                    error={Boolean(touched.workerName && errors.workerName)}
                    helperText={touched.workerName && errors.workerName}
                  />
                </Box>

                <Box sx={({ pb: 3 }, { pt: 3 })}>
                <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.gender && errors.gender)}
                    >
                     Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="gender"
                      label="gender"
                      defaultValue=""
                      {...getFieldProps('gender')}
                      error={Boolean(touched.gender && errors.gender)}
                    >
                      <MenuItem
                        key={0}
                        value={'Male' ?? ''}
                        onClick={() => setDropDownValue('Male')}
                      >
                        Male
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'Female' ?? ''}
                        onClick={() => setDropDownValue('Female')}
                      >
                        Female
                      </MenuItem>

                    </Select>
                    <FormHelperText error={Boolean(touched.gender && errors.gender)}>
                      {touched.gender && errors.gender}
                    </FormHelperText>
                  </FormControl>
                  
                </Box>

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

                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Work Detail"
                    {...getFieldProps('workDetail')}
                    error={Boolean(touched.workDetail && errors.workDetail)}
                    helperText={touched.workDetail && errors.workDetail}
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
                      error={Boolean(touched.period && errors.period)}
                    >
                     Period
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="period"
                      label="period"
                      defaultValue=""
                      {...getFieldProps('period')}
                      error={Boolean(touched.period && errors.period)}
                    >
                      <MenuItem
                        key={0}
                        value={'02 Months' ?? ''}
                        onClick={() => setDropDownValue('02 Months')}
                      >
                        02 Months
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'03 Months' ?? ''}
                        onClick={() => setDropDownValue('03 Months')}
                      >
                        03 Months
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'06 Months' ?? ''}
                        onClick={() => setDropDownValue('06 Months')}
                      >
                        06 Months
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'01 year' ?? ''}
                        onClick={() => setDropDownValue('01 year')}
                      >
                        01 year
                      </MenuItem>
                     
                    </Select>
                    <FormHelperText error={Boolean(touched.period && errors.period)}>
                      {touched.period && errors.period}
                    </FormHelperText>
                  </FormControl>
                  
                </Box>

                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Payment/per day"
                    {...getFieldProps('payment')}
                    error={Boolean(touched.payment && errors.payment)}
                    helperText={touched.payment && errors.payment}
                  />
                </Box>
                {/* <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Total Payment"
                    {...getFieldProps('total')}
                    error={Boolean(touched.total && errors.total)}
                    helperText={touched.total && errors.total}
                  />
                </Box> */}
                
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.workerName !== '' ? (
                <LoadingButton
                  onClick={() => updateAccount(data?.id)}
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