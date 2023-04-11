
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
    name: Yup.string().required('Material name is required'),
    packages: Yup.string().required('Material package is required'),
    cost:Yup.number("Cost is must be number").required('Material cost is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: data.name,
      packages: data.packages,
      cost: data.cost,
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted")
      addNewCustomer();
    }
  });

  const rawData = {
    name: formik.values.name,
    packages: formik.values.packages,
    cost: formik.values.cost,
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
          {data.name !== '' ? 'Edit Customer' : 'Add Customer'}
          <Header
            subtitle="Create a New Customers"
          />
        </DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
              <Box sx={({ pb: 3 }, { pt: 3 })}>
                <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.name && errors.name)}
                    >
                     Material Name
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="name"
                      label="name"
                      defaultValue=""
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                    >
                      <MenuItem
                        key={0}
                        value={'design' ?? ''}
                        onClick={() => setDropDownValue('design')}
                      >
                        Design & Drawings
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'architectual' ?? ''}
                        onClick={() => setDropDownValue('architectual')}
                      >
                        Architectual Design
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'tilles' ?? ''}
                        onClick={() => setDropDownValue('tilles')}
                      >
                        Flooring and Wall Tilling
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'wall' ?? ''}
                        onClick={() => setDropDownValue('wall')}
                      >
                        Compound wall
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'incidentals' ?? ''}
                        onClick={() => setDropDownValue('incidentals')}
                      >
                        Exclusions & Incidentals
                      </MenuItem>
                     
                    </Select>
                    <FormHelperText error={Boolean(touched.name && errors.name)}>
                      {touched.name && errors.name}
                    </FormHelperText>
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
                        value={'essential' ?? ''}
                        onClick={() => setDropDownValue('essential')}
                      >
                        ESSENTIAL
                      </MenuItem>
                      <MenuItem
                        key={0}
                        value={'premium' ?? ''}
                        onClick={() => setDropDownValue('premium')}
                      >
                        PREMIUM
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'luxurious' ?? ''}
                        onClick={() => setDropDownValue('luxurious')}
                      >
                        LUXURIOUS
                      </MenuItem>

                      <MenuItem
                        key={0}
                        value={'theOne' ?? ''}
                        onClick={() => setDropDownValue('theOne')}
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
                    label="Cost"
                    {...getFieldProps('cost')}
                    error={Boolean(touched.cost && errors.cost)}
                    helperText={touched.cost && errors.cost}
                  />
                </Box>
               
               
                
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.name !== '' ? (
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