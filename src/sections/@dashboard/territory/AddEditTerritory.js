import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import { Button, Dialog, TextField, Box } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import TerritoryAddCountry from '../../../../pages/TerritoryAddCountry';
// Api Call
import apiClient from '../../../../api/apiClient';
import headers from '../../../../api/apiHeader';
import messageStyle from '../../../../components/toast/toastStyle';
import apiHandleError from '../../../../api/apiHandleError';

// validation
AddEditTerritoryPopUp.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  name: PropTypes.string
};

export default function AddEditTerritoryPopUp(props) {
  const { data, onClose, onAdd, isEdit, onSuccess } = props;
  const [territoryData, setLanguageData] = React.useState(data);

  // Validation State
  const AddSchema = Yup.object().shape({
    name: Yup.string().required('name is required')
  });

  const handleSuccess = () => {
    onSuccess();
  };

  const formik = useFormik({
    initialValues: {
      name: territoryData.region
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      addTerritory(formik.values);
    }
  });

  /* API Add Territory */
  const addTerritory = async (rawData) => {
    try {
      const territory = {
        region: rawData.name,
        countries: []
      };
      const response = await apiClient.post(`territories`, territory, {
        headers: headers()
      });
      if (response.status === 201) {
        notifySuccess(response.statusText);
        onSuccess();
        onClose();
      } else {
        apiHandleError(response);
      }
      console.log('post', response);
    } catch (error) {
      console.log(error);
    }
  };

  /* API Update Territory */
  const updateTerritory = async (id) => {
    try {
      const rawData = {
        region: formik.values.name,
        countries: territoryData.countries
      };
      console.log(rawData);
      const response = await apiClient.patch(`territories/${id}`, rawData, {
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

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  const notifySuccess = (msg) => toast.success(msg, messageStyle);

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {data.region !== '' ? 'Edit Territory' : 'Add Territory'}
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
                  {data.region !== '' ? (
                    <TerritoryAddCountry onSuccess={handleSuccess} data={territoryData} />
                  ) : (
                    ''
                  )}
                </Box>
              </div>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={onClose}>
                Close
              </Button>
              {data.region !== '' ? (
                <LoadingButton
                  size="medium"
                  variant="contained"
                  onClick={() => updateTerritory(data._id)}
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
