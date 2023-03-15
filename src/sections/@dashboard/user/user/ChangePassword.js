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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
// Toast
import { toast, ToastContainer } from 'react-toastify';
import messageStyle from '../../../components/toast/toastStyle';

// Api Call
import apiClient from '../../../api/apiClient';
import headers from '../../../api/apiHeader';
import apiHandleError from '../../../api/apiHandleError';

// component
import Iconify from '../../../components/Iconify';

// validation
ChangePasssword.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  code: PropTypes.string,
  name: PropTypes.string
};

export default function ChangePasssword(props) {
  const { data, onClose, onAdd, isEdit } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  // Validation State

  const AddSchema = Yup.object().shape({
    password: Yup.string().required('password is required')
  });

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const formik = useFormik({
    initialValues: {
      name: data.name,
      email: data.email,
      password: '',
      roleId: data.roleId
    },

    validationSchema: AddSchema,
    onSubmit: () => {
      ChangePasssword(data._id);
    }
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const rawData = {
    password: formik.values.password
  };

  const changePasssword = async (id) => {
    try {
      const response = await apiClient.patch(`users/${id}`, rawData, {
        headers: headers()
      });

      if (response.status === 201) {
        notifySuccess(response.statusText);
        onClose();
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
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
        <DialogTitle id="responsive-dialog-title">Change Password For</DialogTitle>
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
              <Button autoFocus variant="outlined" onClick={onClose}>
                Close
              </Button>
              <LoadingButton
                size="medium"
                variant="contained"
                type="submit"
                onClick={() => changePasssword(data._id)}
                Loading={isSubmitting}
              >
                Change
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
