
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
    accessLevel: Yup.string().required('accessLevel is required'),
    // email: Yup.string().required('email is required'),
    description: Yup.string().required('description is required'),
   
  });

  const formik = useFormik({
    initialValues: {
      accessLevel: data.accessLevel,
      // email: data.email,
      description: data.description,
 
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewRole();
    }
  });

  const rawData = {
    accessLevel: formik.values.accessLevel,
    // email: formik.values.email,
    description: formik.values.description,

  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const addNewRole = async () => {
    try {
      
      const response = await apiClient.post('role/add', rawData, {
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
  const updateRole = async (id) => {
    try {
      const response = await apiClient.post(`role/update/${id}`, rawData, {
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
          {data.accessLevel !== '' ? 'Edit Role' : 'Add Role'}
          <Header
            subtitle="Create a New Access Level"
          />
        </DialogTitle>
      
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
              <Box sx={({ pb: 3 }, { pt: 0 })}>
                <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.accessLevel && errors.accessLevel)}
                    >
                      Access Level
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="accessLevel"
                      label="Access Level"
                      defaultValue=""
                      {...getFieldProps('accessLevel')}
                      error={Boolean(touched.accessLevel && errors.accessLevel)}
                    >
                      <MenuItem
                        key={0}
                        value={'Admin' ?? ''}
                        onClick={() => setDropDownValue('Admin')}
                      >
                        Admin
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'Super Admin' ?? ''}
                        onClick={() => setDropDownValue('Super Admin')}
                      >
                        Super Admin
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'Admin Manager' ?? ''}
                        onClick={() => setDropDownValue('Admin Manager')}
                      >
                        Admin Manager
                      </MenuItem>
                     
                    </Select>
                    <FormHelperText error={Boolean(touched.accessLevel && errors.accessLevel)}>
                      {touched.accessLevel && errors.accessLevel}
                    </FormHelperText>
                  </FormControl>
                  
                </Box>
                {/* <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box> */}
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Box>
              
                
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.accessLevel !== '' ? (
                <LoadingButton
                  onClick={() => updateRole(data?.id)}
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