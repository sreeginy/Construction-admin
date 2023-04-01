import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import { Button, Dialog, Box, Stack } from '@mui/material';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
// Api Call
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import headers from '../../../api/apiHeader';
import apiClient from '../../../api/apiClient';
import messageStyle from '../../../components/toast/toastStyle';
import apiHandleError from '../../../api/apiHandleError';

// validation
ImageUpload.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object
};

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
const notifySuccess = (msg) => toast.success(msg, messageStyle);
export default function ImageUpload(props) {
  const { onClose, onSuccess, data } = props;
  const [imagePreview, setImagePreview] = useState('/static/placeholder.jpg');

  // Validations
  const AddSchema = Yup.object().shape({
    image: Yup.mixed()
      .required('A file is required')
      .test(
        'fileFormat',
        'Unsupported Format',
        (value) => value && SUPPORTED_FORMATS.includes(value.type)
      )
  });

  React.useEffect(() => {
    setImagePreview(data?.libraryImageUrl || imagePreview);
  }, []);

  const formik = useFormik({
    initialValues: {
      image: null
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      const rawData = values.image;
      uploadLibraryImage(rawData);
      console.log(rawData);
      formik.setSubmitting(false);
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  /* API Upload Image Library */
  const uploadLibraryImage = async (file) => {
    const dataForm = new FormData();
    dataForm.append('library_id', data?._id);
    dataForm.append('library_avatar', file);
    console.log(data);
    try {
      const response = await apiClient.post('library/uploadimage', dataForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
        }
      });
      if (response.status === 200) {
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

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Upload Image</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <Stack direction="column" spacing={3}>
                    <Card sx={{ maxWidth: 800 }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={imagePreview}
                        alt="Image Preview"
                      />
                    </Card>
                  </Stack>
                </Box>
              </div>
            </DialogContent>
            <DialogContent>
              <div>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <Stack direction="column" spacing={3}>
                    <Button variant="contained" component="label" startIcon="">
                      Choose Image
                      <input
                        name="image"
                        accept="image/*"
                        type="file"
                        hidden
                        onChange={(e) => {
                          const fileReader = new FileReader();
                          fileReader.onload = () => {
                            if (fileReader.readyState === 2) {
                              setFieldValue('image', e.target.files[0]);
                              setImagePreview(fileReader.result);
                            }
                          };
                          fileReader.readAsDataURL(e.target.files[0]);
                        }}
                      />
                    </Button>
                  </Stack>
                </Box>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={onClose}>
                Close
              </Button>
              {values.image == null && data?.libraryImageUrl ? (
                ''
              ) : (
                <LoadingButton
                  size="medium"
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                >
                  Upload
                </LoadingButton>
              )}
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
