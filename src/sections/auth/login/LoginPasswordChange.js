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
  OutlinedInput,
  InputAdornment,
  IconButton
  
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
// component
import Iconify from '../../../components/iconify';
// Api Call
import apiClient from '../../../api/apiClient';
import headers from '../../../api/apiHeader';
// Toast
import messageStyle from '../../../components/toast/toastStyle';
// validation
LoginPassswordChange.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  name: PropTypes.string,
  token: PropTypes.string,
  submit: PropTypes.func
};

export default function LoginPassswordChange(props) {
  const { data, onClose, onAdd, submit, token } = props;
  const { name, email, _id, roleId } = data;
  const [dataValue, setDataValue] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // Validation State
  const AddSchema = Yup.object().shape({
    password: Yup.string().required('password is required')
  });

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log(rawData);
      updateUser(_id);
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const rawData = {
    name,
    email,
    password: values.password,
    isPasswordChanged: false,
    roleId
  };
  const notifySuccess = (msg) => toast.success(msg, messageStyle);

  const updateUser = async (id) => {
    try {
      const response = await apiClient.patch(`users/${id}`, rawData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        submit();
        notifySuccess(response.statusText);
      } else {
        onClose();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      onClose();
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
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
        <DialogTitle id="responsive-dialog-title">Change Password For {name}</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
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
            <DialogActions>
              <Button autoFocus onClick={onClose}>
                Close
              </Button>
              <Button type="submit" autoFocus>
                Change
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
