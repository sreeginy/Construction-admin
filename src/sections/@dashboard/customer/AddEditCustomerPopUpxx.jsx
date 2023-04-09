import { Box, Button, TextField,  Dialog, Grid,  InputAdornment,  IconButton,
    FormControl,
    Autocomplete } from "@mui/material";
import { Form, FormikProvider, useFormik } from 'formik';
import * as yup from "yup";
import * as React from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import PropTypes from 'prop-types';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadingButton } from '@mui/lab';
import DialogTitle from '@mui/material/DialogTitle';

// Api Call
import apiClient from '../../../api/apiClient';
import headers from '../../../api/apiHeader';
import apiHandleError from '../../../api/apiHandleError';

import { toast, ToastContainer } from 'react-toastify';
// Toast
import messageStyle from '../../../components/toast/toastStyle';
// component
import Iconify from '../../../components/iconify';

// validation
AddEditCustomerPopUp.propTypes = {
    onClose: PropTypes.func,
    data: PropTypes.object,
    title: PropTypes.string,
    code: PropTypes.string,
    name: PropTypes.string,
    onSuccess: PropTypes.func,
  };


export default function AddEditCustomerPopUp(props) {
  const { data, onClose, onAdd, isEdit, onSuccess } = props;
// const [roleData, setRoleData] = React.useState(data);
    const [roleId, setRoleId] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
//  const { id, firstName,lastName, address, email, contactNo,deliveryAddress } = roleData;
    const [projectNameList, setProjectStatusList] = React.useState([]);
    const [customerData, setCustomerData] = React.useState({
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      email: data.email,
      contactNo: data.contactNo,
      deliveryAddress: data.deliveryAddress,
    });

    React.useEffect(() => {
      // getRolesList();
    }, []);

  


const AddSchema = yup.object().shape({
    id: yup.string().required("required"),
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    address: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required('password is required'),
    contactNo: yup.string().required("required"),
    deliveryAddress: yup.string().required("required"),
});

const formik = useFormik({
    initialValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      deliveryAddress: data.deliveryAddress,
      contactNo: data.contactNo,
      password: ''
      
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log("submitted");
      addNewCustomer();
    }
  });

  const rawData = {
    firstName: formik.values.firstName,
    lastName: formik.values.lastName,
    address: formik.values.address,
    email: formik.values.email,
    password: formik.values.password,
    contactNo: formik.values.contactNo,
    deliveryAddress: formik.values.deliveryAddress
  };

  
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const notifySuccess = (msg) => toast.success(msg, messageStyle);
  const notifyError = (msg) => toast.error(msg, messageStyle);


  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
  formik;


//   const initialValues = {
//     id: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     userEmail: "",
//     contact: "",
//     deliveryAddress: "",
// }



 

    
  const addNewCustomer = async () => {
    try {
      const response = await apiClient.post('/customers/add', rawData, {
        headers: headers()
      });

      if (response.status === 200) {
        if (response.data.status === 1000) {
          notifySuccess(response.data.message);
          onSuccess();
          onClose();
        } else {
          formik.isSubmitting = false
          notifyError(response.data.message);
        }
      } else {
        formik.isSubmitting = false
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };


  // Update customer Api
  const updateCustomer = async (id) => {
    try {
      const response = await apiClient.post(`customers/update/${id}`, rawData, {
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

    // const addNewCustomer = async (rawData) => {
    //   console.log(rawData);
    //   try {
    //     const products = {
    //      id: rawData.id,
    //      firstName: rawData.firstName,
    //      lastName: rawData.lastName,
    //      address: rawData.address,
    //      userEmail: rawData.userEmail,
    //      contact: rawData.contact,
    //      deliveryAddress: rawData.deliveryAddress,
       
    //     };
    //     const response = await apiClient.post(`/customers/add`, rawData, {
    //       headers: headers()
    //     });
    //     if (response.status === 200) {
    //       if (response.data.status === 1000) {
    //         notifySuccess(response.data.message);
    //         onSuccess();
    //         onClose();
    //       } else {
    //         // setSubmitting(false);
    //         notifyError(response.data.message);
    //       }
    //     } else {
    //       // setSubmitting(false);
    //       apiHandleError(response);
    //     }
    //     console.log('post', response);
    //   } catch (error) {
    //     // setSubmitting(false);
    //     console.log(error);
    //   }
    // };
    


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
          {data.firstName !== '' ? 'Edit Customer' : 'Add Customer'}
        </DialogTitle>
        <Grid marginLeft={5} marginRight={5} marginTop={3} marginBottom={2}>

          <Header
            title="CREATE CUSTOMERLIST"
            subtitle="Create a New Customers"
          />

          <div>
            <FormikProvider value={formik} >
              <Form autoComplete="off" noValidate onSubmit={handleSubmit} >
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="FirstName"
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="LastName"
                      {...getFieldProps('lastName')}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Address"
                      {...getFieldProps('address')}
                      error={Boolean(touched.address && errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Email"
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Contact No"
                      {...getFieldProps('contactNo')}
                      error={Boolean(touched.contactNo && errors.contactNo)}
                      helperText={touched.contactNo && errors.contactNo}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="DeliveryAddress"
                      {...getFieldProps('deliveryAddress')}
                      error={Boolean(touched.deliveryAddress && errors.deliveryAddress)}
                      helperText={touched.deliveryAddress && errors.deliveryAddress}
                    />
                  </Grid>

                  {data.firstName !== '' ? ' ' : <Box sx={({ pb: 3 }, { pt: 3 })}>
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
                </Box>}

            
                  <DialogActions sx={{ mt: 3, marginLeft: 39 }}>
                    <Button variant="outlined" autoFocus onClick={onClose} color={"info"}>
                      Close
                    </Button>
                    {/* <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}>
                Create
              </LoadingButton> */}
                    {/* <Button type="submit" variant="contained" autoFocus color={"info"}>
                      {id !== '' ? 'Edit' : 'Add Customer'}
                    </Button> */}

{data.firstName !== '' ? (
                <LoadingButton
                  onClick={() => updateCustomer(data?.id)}
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

                </Grid>
              </Form>
            </FormikProvider>
          </div>
        </Grid>
      </Dialog>
    </div>
  );
}

// export default Form;