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
// import { toast, ToastContainer } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email
  });

  React.useEffect(() => {
    // getRolesList();
  }, []);

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);

  // Validation State
  const AddSchema = Yup.object().shape({
    firstName: Yup.string().required('firstname is required'),
    lastName: Yup.string().required('lastname is required'),
    email: Yup.string().required('email is required'),
    password: Yup.string().required('password is required')
  });

  const formik = useFormik({
    initialValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: '',
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
  // const getRolesList = async () => {
  //   try {
  //     const response = await apiClient.get('roles', {
  //       headers: headers()
  //     });

  //     if (response.status === 200) {
  //       setRoleList(response.data.role);
  //     } else {
  //       apiHandleError(response);
  //     }
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const addNewUser = async () => {
    try {
      const response = await apiClient.post('/user/add', rawData, {
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

  const rawData = {
    firstName: formik.values.firstName,
    lastName: formik.values.lastName,
    email: formik.values.email,
    password: formik.values.password,
    isPasswordChanged: formik.values.isPasswordChanged
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
              </div>
            </DialogContent>
            {/* <Stack
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
            </Stack> */}
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting} >
                Create
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
      <ToastContainer/>
    </div>
  );
}
