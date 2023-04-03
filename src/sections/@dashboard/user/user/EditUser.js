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

export default function EditUser(props) {
  const { data, onClose, onSuccess } = props;
  const [dataValue, setDataValue] = React.useState('');
  const [roleList, setRoleList] = React.useState([]);
  const [roleId, setRoleId] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);

  const [userData, setUserData] = React.useState({
    name: data.name,
    email: data.email,
    roleId: data.roleId
  });

  React.useEffect(() => {
    getRolesList();
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
    name: Yup.string().required('name is required'),
    email: Yup.string().required('email is required'),
    role: Yup.string().required('role is required')
  });

  const formik = useFormik({
    initialValues: {
      name: userData.name,
      email: userData.email,
      role: userData.roleId && userData.roleId.roleName
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      updateUser(data._id);
    }
  });

  const rawData = {
    name: formik.values.name,
    email: formik.values.email,
    password: formik.values.password,
    roleId
  };

  const updateUser = async (id) => {
    try {
      const response = await apiClient.patch(`users/${id}`, rawData, {
        headers: headers()
      });

      if (response.status === 201) {
        onClose();
        notifySuccess(response.statusText);
        onSuccess();
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
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
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

                <Box sx={({ pb: 3 }, { pt: 5 })}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={Boolean(touched.role && errors.role)}
                    >
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.role}
                      defaultValue=""
                      label="Role"
                      {...getFieldProps('role')}
                      error={Boolean(touched.role && errors.role)}
                    >
                      {roleList.map((role) => (
                        <MenuItem
                          key={role._id}
                          value={role.roleName}
                          onClick={() => setDropDownValue(role._id)}
                        >
                          {role.roleName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error={Boolean(touched.role && errors.role)}>
                      {touched.role && errors.role}
                    </FormHelperText>
                  </FormControl>
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
