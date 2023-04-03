import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
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
  InputAdornment,
  IconButton,
  FormHelperText,
  Stack,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
// component
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../../../components/iconify';
// Api Call
import apiClient from '../../../../api/apiClient';
import headers from '../../../../api/apiHeader';
import apiHandleError from '../../../../api/apiHandleError';

// Toast
import messageStyle from '../../../../components/toast/toastStyle';

// validation
AddUser.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  code: PropTypes.string,
  name: PropTypes.string
};

export default function AddUser(props) {
  const { data, onClose, onAdd, isEdit, onSuccess } = props;
  const [roleList, setRoleList] = React.useState([]);
  const [roleId, setRoleId] = React.useState('');
  const [dataValue, setDataValue] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: data.name,
    email: data.email,
    role: data.role
  });

  React.useEffect(() => {
    getRolesList();
  }, []);

  const notifySuccess = (msg) => toast.success(msg, messageStyle);

  // Validation State
  const AddSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    email: Yup.string().required('email is required'),
    role: Yup.string().required('role is required'),
    password: Yup.string().required('password is required')
  });

  const formik = useFormik({
    initialValues: {
      name: userData.name,
      email: userData.email,
      password: '',
      role: userData.role,
      isPasswordChanged: true
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      addNewUser();
      console.log(rawData);
    }
  });
  const setDropDownValue = (value) => {
    setRoleId(value);
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
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

  const addNewUser = async () => {
    try {
      const response = await apiClient.post('users', rawData, {
        headers: headers()
      });

      if (response.status === 201) {
        notifySuccess(response.statusText);
        onSuccess();
        onClose();
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const rawData = {
    name: formik.values.name,
    email: formik.values.email,
    password: formik.values.password,
    isPasswordChanged: formik.values.isPasswordChanged,
    roleId
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
        <DialogTitle id="responsive-dialog-title">Add User Data</DialogTitle>
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
                <Box sx={({ pb: 3 }, { pt: 3 })}>
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
                </Box>
                {/* <Box sx={({ pb: 3 }, { pt: 5 })}>
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
                      value={roleList}
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
                </Box> */}
              </div>
            </DialogContent>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    {...getFieldProps('isPasswordChanged')}
                    checked={values.isPasswordChanged}
                  />
                }
                label="Password Change"
              />
            </Stack>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}>
                Create
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
