import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  Button,
  Dialog,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
// component
import Iconify from '../../../../components/iconify';
// Api Call
import apiClient from '../../../../api/apiClient';
import headers from '../../../../api/apiHeader';
import apiHandleError from '../../../../api/apiHandleError';
// Toast
import messageStyle from '../../../../components/toast/toastStyle';

// validation
EditUser.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  code: PropTypes.string,
  name: PropTypes.string
};

const notifySuccess = (msg) => toast.success(msg, messageStyle);
const notifyError = (msg) => toast.error(msg, messageStyle);

export default function EditUser(props) {
  const { data, onClose, onSuccess } = props;
  const [dataValue, setDataValue] = React.useState('');
  const [roleList, setRoleList] = React.useState([]);
  const [roleId, setRoleId] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);

  const [userData, setUserData] = React.useState({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email
  });

  React.useEffect(() => {
    // getRolesList();
  }, []);

  const getRolesList = async () => {
    try {
      const response = await apiClient.get('roles', {
        headers: headers()
      });

      if (response.status === 200) {
        setRoleList(response.data.role);
      } else {
        apiHandleError(response);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Validation State
  const AddSchema = Yup.object().shape({
    firstName: Yup.string().required('firstname is required'),
    lastName: Yup.string().required('lastname is required'),
    email: Yup.string().required('email is required')
  });

  const formik = useFormik({
    initialValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      updateUser(data.id);
    }
  });

  const rawData = {
    firstName: formik.values.firstName,
    lastName: formik.values.lastName,
    email: formik.values.email
  };

  const updateUser = async (id) => {
    try {
      const response = await apiClient.post(`user/update/${id}`, rawData, {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          onClose();
          notifySuccess(response.data.message);
          onSuccess();
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

  const setDropDownValue = (value) => {
    setRoleId(value);
    console.log(values.role);
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Edit User Data</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
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
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              <Button variant="contained" type="submit" autoFocus>
                Save
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
