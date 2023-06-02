
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

    projectName: Yup.string().required('Project name is required'),
    packages: Yup.string().required('Packages is required'),
    description: Yup.string().required('Description  is required'),
    duration:Yup.number("Duration is must be number").required('Duration is required'),
    location:Yup.string().required('Location is required'),
    clientName:Yup.string().required('ClientName is required'),
    projectSqft: Yup.number("Square fit is must be number").required('Square fit is required'),
    projectRoom: Yup.number("House's Rooms is must be number").required('House rooms is required'),
    status:Yup.string().required('status is required'),

  });

  const formik = useFormik({
    initialValues: {
      projectName: data.projectName,
      packages: data.packages,
      description: data.description,
      duration: data.duration,
      location: data.location,
      clientName: data.clientName,
      projectSqft: data.projectSqft,
      projectRoom: data.projectRoom,
      status: data.status,
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewProject();
    }
  });

  const rawData = {
    projectName: formik.values.projectName,
    packages: formik.values.packages,
    description: formik.values.description,
    duration: formik.values.duration,
    location: formik.values.location,
    clientName: formik.values.clientName,
    projectSqft: formik.values.projectSqft,
    projectRoom: formik.values.projectRoom,
    status: formik.values.status,
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

  const addNewProject = async () => {
    try {
      
      const response = await apiClient.post('project/add', rawData, {
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
  const updateProject = async (id) => {
    try {
      const response = await apiClient.post(`project/update/${id}`, rawData, {
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
          {data.projectName !== '' ? 'EDIT  PROJECT  DETAILS' : 'ADD PROJECT DETAILS'}
          <Header
            subtitle="Create a New Portfolio"
          />
        </DialogTitle>
        
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
                <Box sx={({ pb: 3 })} >
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Project Name"
                    {...getFieldProps('projectName')}
                    error={Boolean(touched.projectName && errors.projectName)}
                    helperText={touched.projectName && errors.projectName}
                  />
                </Box>
              
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.packages && errors.packages)}
                    >
                     Packages
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
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Duration"
                    {...getFieldProps('duration')}
                    error={Boolean(touched.duration && errors.duration)}
                    helperText={touched.duration && errors.duration}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Location"
                    {...getFieldProps('location')}
                    error={Boolean(touched.location && errors.location)}
                    helperText={touched.location && errors.location}
                  />
                </Box>

                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Client Name"
                    {...getFieldProps('clientName')}
                    error={Boolean(touched.clientName && errors.clientName)}
                    helperText={touched.clientName && errors.clientName}
                  />
                </Box>
              
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    type="number"
                    id="outlined-basic"
                    label="projectSqft"
                    {...getFieldProps('projectSqft')}
                    error={Boolean(touched.projectSqft && errors.projectSqft)}
                    helperText={touched.projectSqft && errors.projectSqft}
                  />
                </Box>
                 
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    type="number"
                    id="outlined-basic"
                    label="Rooms"
                    {...getFieldProps('projectRoom')}
                    error={Boolean(touched.projectRoom && errors.projectRoom)}
                    helperText={touched.projectRoom && errors.projectRoom}
                  />
                </Box>

                <Box sx={({ pb: 3 }, { pt: 3 })}>
                <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.status && errors.status)}
                    >
                     Project Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="status"
                      label="status"
                      defaultValue=""
                      {...getFieldProps('status')}
                      error={Boolean(touched.status && errors.status)}
                    >
                      <MenuItem
                        key={0}
                        value={'Active' ?? ''}
                        onClick={() => setDropDownValue('Active')}
                      >
                        Active
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'Banned' ?? ''}
                        onClick={() => setDropDownValue('Banned')}
                      >
                        Banned
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
              {data.projectName !== '' ? (
                <LoadingButton
                  onClick={() => updateProject(data?.id)}
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