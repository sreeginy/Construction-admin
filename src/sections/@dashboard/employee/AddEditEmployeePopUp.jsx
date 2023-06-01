
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

  // Validations
  const AddSchema = Yup.object().shape({

    employeeName: Yup.string().required('employee name is required'),
    position: Yup.string().required('position is required'),
    bio: Yup.string().required('bio  is required'),
    email:Yup.string().required('Duration is required'),
    streamUrl:Yup.string().required('streamUrl is required'),


  });

  const formik = useFormik({
    initialValues: {
      employeeName: data.employeeName,
      position: data.position,
      bio: data.bio,
      email: data.email,
      streamUrl: data.streamUrl,
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewEmployee();
    }
  });

  const rawData = {
    employeeName: formik.values.employeeName,
    position: formik.values.position,
    bio: formik.values.bio,
    email: formik.values.email,
    streamUrl: formik.values.streamUrl,
   
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const setDropDownValue = (value) => {
    setStatusId(value);
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const addNewEmployee = async () => {
    try {
      
      const response = await apiClient.post('employee/add', rawData, {
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
  const updateEmployee = async (id) => {
    try {
      const response = await apiClient.post(`employee/update/${id}`, rawData, {
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


        <DialogTitle id="responsive-dialog-title" variant="h3" mt={2}>
          {data.employeeName !== '' ? 'Edit Project' : 'Add Project'}
          <Header
            subtitle="Create a New Portfolio"
          />
        </DialogTitle>
        
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
                <Box >
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Employee Name"
                    {...getFieldProps('employeeName')}
                    error={Boolean(touched.employeeName && errors.employeeName)}
                    helperText={touched.employeeName && errors.employeeName}
                  />
                </Box>
              
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.position && errors.position)}
                    >
                     Position
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="position"
                      label="position"
                      defaultValue=""
                      {...getFieldProps('position')}
                      error={Boolean(touched.position && errors.position)}
                    >
                      <MenuItem
                        key={0}
                        value={'Civil Engineer' ?? ''}
                        onClick={() => setDropDownValue('Civil Engineer')}
                      >
                        Civil Engineer
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'Architecture' ?? ''}
                        onClick={() => setDropDownValue('Architecture')}
                      >
                        Architecture
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'Design Engineer' ?? ''}
                        onClick={() => setDropDownValue('Design Engineer')}
                      >
                        Design Engineer
                      </MenuItem>

                     
                    </Select>
                    <FormHelperText error={Boolean(touched.position && errors.position)}>
                      {touched.position && errors.position}
                    </FormHelperText>
                  </FormControl>
                </Box>

                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Bio"
                    {...getFieldProps('bio')}
                    error={Boolean(touched.bio && errors.bio)}
                    helperText={touched.bio && errors.bio}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="E-mail"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="FacebooK link"
                    {...getFieldProps('streamUrl')}
                    error={Boolean(touched.streamUrl && errors.streamUrl)}
                    helperText={touched.streamUrl && errors.streamUrl}
                  />
                </Box>
                
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.employeeName !== '' ? (
                <LoadingButton
                  onClick={() => updateEmployee(data?.id)}
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