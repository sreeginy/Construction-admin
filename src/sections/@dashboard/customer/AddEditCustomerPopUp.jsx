import { Box, Button, TextField,  Dialog, Grid,
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

// Api Call
import apiClient from '../../../api/apiClient';
import headers from '../../../api/apiHeader';
import apiHandleError from '../../../api/apiHandleError';

import { toast, ToastContainer } from 'react-toastify';
// Toast
import messageStyle from '../../../components/toast/toastStyle';


// validation
AddEditCustomerPopUp.propTypes = {
    onClose: PropTypes.func,
    data: PropTypes.object,
    title: PropTypes.string,
    code: PropTypes.string,
    name: PropTypes.string
  };


export default function AddEditCustomerPopUp(props) {
    const { data, onClose, onSuccess} = props;
    const [roleData, setRoleData] = React.useState(data);
    const { id, firstName,lastName, address, userEmail, contact,deliveryAddress } = roleData;
    const [projectNameList, setProjectStatusList] = React.useState([]);
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


const AddSchema = yup.object().shape({
    id: yup.string().required("required"),
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    address: yup.string().required("required"),
    userEmail: yup.string().email("invalid email").required("required"),
    contact: yup.string().required("required"),
    deliveryAddress: yup.string().required("required"),
});

const formik = useFormik({
    initialValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      userEmail: userData.userEmail,
      contact: userData.contact,
      deliveryAddress: userData.deliveryAddress,
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      addNewCustomer();
      console.log(rawData);
    }
  });

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
    address: formik.values.address,
    userEmail: formik.values.userEmail,
    contact: formik.values.contact,
    deliveryAddress: formik.values.deliveryAddress
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
                      {...getFieldProps('userEmail')}
                      error={Boolean(touched.userEmail && errors.userEmail)}
                      helperText={touched.userEmail && errors.userEmail}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Contact No"
                      {...getFieldProps('contact')}
                      error={Boolean(touched.contact && errors.contact)}
                      helperText={touched.contact && errors.contact}
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

            
                  <DialogActions sx={{ mt: 3, marginLeft: 39 }}>
                    <Button variant="outlined" autoFocus onClick={onClose} color={"info"}>
                      Close
                    </Button>
                    <LoadingButton size="medium" type="submit" variant="contained" loading={isSubmitting}>
                Create
              </LoadingButton>
                    {/* <Button type="submit" variant="contained" autoFocus color={"info"}>
                      {id !== '' ? 'Edit' : 'Add Customer'}
                    </Button> */}
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