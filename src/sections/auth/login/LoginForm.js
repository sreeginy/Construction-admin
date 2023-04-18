import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';

// Toast
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import messageStyle from '../../../components/toast/toastStyle';
import { ToastContainer } from 'react-toastify';
// Api Call
import apiClient from '../../../api/apiClient';
// component
import Iconify from '../../../components/iconify';
import LoginPassswordChange from './LoginPasswordChange';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [userName, setUserName] = useState();
  const [token, setToken] = useState();
  const [user, setUser] = useState();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const handleOpenPassword = () => {
    setOpenPassword(true);
  };

  const handlePasswordClose = () => {
    setSubmit(false);
    setOpenPassword(false);
  };

  const onPasswordChange = () => {
    localStorage.setItem('jwt-token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setSubmit(false);
    navigate('/dashboard/app', { replace: true });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      handleLogin();
      console.log(rawData);
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const rawData = {
    username: values.email,
    password: values.password
  };
  const notifyError = (msg) => toast.error(msg, messageStyle);
  const handleLogin = async () => {
    setSubmit(isSubmitting);
    try {
      const res_ = await apiClient.post('user/login', rawData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res_.status === 200) {
        setToken(res_.data.data.token);
        setUser(res_.data.data);
        // if (true) {
        localStorage.setItem('jwt-token', res_.data.data.token);
        localStorage.setItem('user', JSON.stringify(res_.data.data));
        setSubmit(false);
        navigate('/dashboard/app', { replace: true });
      } else if (res_.status === 400) {
        notifyError('Email address or password not match');
      }
      console.log(res_);
    } catch (error) {
      notifyError('Email address or password not match');
      setSubmit(false);
      console.log(error);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };


  return (
    <FormikProvider value={formik}>
    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
      {openPassword ? (
        <LoginPassswordChange
          onClose={handlePasswordClose}
          submit={onPasswordChange}
          data={user}
          token={token}
        />
      ) : (
        ''
      )}
      <Stack spacing={3}>
        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          {...getFieldProps('email')}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />

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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <FormControlLabel
          control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
          label="Remember me"
        />

        {/* <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={submit}>
        Login
      </LoadingButton>
    </Form>
    <ToastContainer />
  </FormikProvider>

  );
}
