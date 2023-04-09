import * as React from 'react';
import * as Yup from 'yup';
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

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Iconify from './iconify';
// Api Call
import apiClient from '../api/apiClient';
import headers from '../api/apiHeader';
import apiHandleError from '../api/apiHandleError';

// Toast
import messageStyle from './toast/toastStyle';

// validation
DeleteDialogPopUp.propTypes = {
  onClose: PropTypes.func
};
export default function DeleteDialogPopUp(props) {
  const { onClose, onDelete } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = useState([]);

  // Validation State

  const AddSchema = Yup.object().shape({});

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      password: ''
    },

    validationSchema: AddSchema,
    onSubmit: () => {
      validatePasssword();
    }
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const rawData = {
    email: user.email,
    password: formik.values.password
  };
  console.log(rawData);

  const validatePasssword = async () => {
    onDelete();
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
        <DialogTitle id="responsive-dialog-title">Delete</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>

            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                endIcon={<Iconify icon="eva:trash-2-outline" />}
                type="submit"
                Loading={isSubmitting}
                autoFocus
              >
                Delete
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
