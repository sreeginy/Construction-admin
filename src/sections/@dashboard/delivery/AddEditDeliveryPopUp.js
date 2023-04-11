import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { Button, Dialog, TextField, Box } from '@mui/material';
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

// validation
AddEditRatingsPopUp.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  data: PropTypes.object,
  desc: PropTypes.string,
  name: PropTypes.string
};

export default function AddEditRatingsPopUp(props) {
  const { data, onClose, onSuccess } = props;
  const [partnersData, setPartnersData] = React.useState({
    name: data.name,
    cost: data.cost,
    duration: data.duration
  });

  // Validations
  const AddSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    cost: Yup.string().required('cost is required'),
    duration: Yup.string().required('duration is required')
  });

  const formik = useFormik({
    initialValues: {
      name: partnersData.name,
      cost: partnersData.cost,
      duration: partnersData.duration
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      addNewRating();
    }
  });

  const rawData = {
    name: formik.values.name,
    cost: formik.values.cost,
    duration: formik.values.duration
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);

  const addNewRating = async () => {
    try {
      const response = await apiClient.post('partners/add', rawData, {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          onSuccess();
          onClose();
        } else {
          notifyError(response.data.message);
          onClose();
        }
      } else {
        apiHandleError(response);
        onClose();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Update Rating Api
  const updateRating = async (id) => {
    try {
      const response = await apiClient.post(`partners/update/${id}`, rawData, {
        headers: headers()
      });

      if (response.status === 200) {
        notifySuccess(response.data.message);
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
        <DialogTitle id="responsive-dialog-title">
          {data.name !== '' ? 'Edit Delivery Partners' : 'Add Delivery Partners'}
        </DialogTitle>
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
                    label="Cost"
                    {...getFieldProps('cost')}
                    error={Boolean(touched.cost && errors.cost)}
                    helperText={touched.cost && errors.cost}
                  />
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Duration"
                    {...getFieldProps('duration')}
                    error={Boolean(touched.duration && errors.duration)}
                    helperText={touched.duration && errors.duration}
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
                  onClick={() => updateRating(data?.id)}
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
