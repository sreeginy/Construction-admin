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
  FormHelperText,
  Autocomplete
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
import apiHandleError from '../../../api/apiHandleError';
// Toast
import messageStyle from '../../../components/toast/toastStyle';

// validation
ChangeStatus.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  code: PropTypes.string,
  name: PropTypes.string
};

const status = [{ status: 'Pending' }, { status: 'Completed' }, { status: 'Cancelled' }];

const notifySuccess = (msg) => toast.success(msg, messageStyle);
const notifyError = (msg) => toast.error(msg, messageStyle);

export default function ChangeStatus(props) {
  const { data, onClose, onSuccess } = props;
  const [dataValue, setDataValue] = React.useState('');
  const [roleList, setRoleList] = React.useState([]);
  const [roleId, setRoleId] = React.useState('');
  const [statusList, setStatusList] = React.useState(status);

  const [showPassword, setShowPassword] = React.useState(false);

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
    status: Yup.object().required('Order status is required')
  });

  const formik = useFormik({
    initialValues: {
      status: data?.row?.orderStatus
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      updateUser(data.id);
    }
  });

  const updateUser = async (id) => {
    const rawData = {
      orderStatus: formik.values.status.status
    };
    try {
      const response = await apiClient.put(`orders/update/${id}`, rawData, {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          onClose();
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
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Change Status</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      disableClearable
                      options={statusList}
                      {...getFieldProps('status')}
                      onChange={(event, newValue) => setFieldValue('status', newValue)}
                      getOptionLabel={(option) => option.status}
                      renderInput={(params) => <TextField {...params} label="Status" />}
                    />
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
