

import {
  Button,
  TextField,
  Grid,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  Chip,
  useTheme,
  Autocomplete,
  Dialog
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
// import { Formik } from "formik";
import { Form, FormikProvider, useFormik } from 'formik';
import * as yup from "yup";
import * as React from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import PropTypes from 'prop-types';
import DialogContent from '@mui/material/DialogContent';

// validation
AddEditProductPopUp.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  title: PropTypes.string
};

const initialValues = {
  id: "",
  pro_name: "",
  pro_type: "",
  price: "",
  pro_item: "",
  pro_status: "",
}

export default function AddEditProductPopUp(props) {
  const { data, onClose } = props;
  const [roleData, setRoleData] = React.useState(data);
  const { id, pro_name, pro_type, price, pro_item, pro_status } = roleData;

  const [ProductNameList, setProductStatusList] = React.useState([]);
  const [statusId, setStatusId] = React.useState();

  const setDropDownValue = (value) => {
    setStatusId(value);
  };
  const AddSchema = yup.object().shape({
    id: yup.string().required("Product id is required"),
    pro_name: yup.string().required("Product name is required"),
    pro_type: yup.string().required("Product type is required"),
    price: yup.string().required("Product price is required"),
    pro_item: yup.string().required("Product item is required"),
    pro_status: yup.string().required("Product status is required"),

  });

  const formik = useFormik({
    initialValues: {
      id,
      pro_name,
      pro_type,
      price,
      pro_item,
      pro_status,
    },
    validationSchema: AddSchema,
    // onSubmit: () => {
    //    savePitchTracker(formik.values);
    // }
  });

  // const Form = () => {
  //     const isNonMobile = useMediaQuery("(min-width:600px");

  //     const handleFormSubmit = (values) => {
  //         console.log(values);
  //     };

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
            title="CREATE PRODUCT"
            subtitle="Create a New Cement Product"
          />

          <div>
            <FormikProvider value={formik} >
              <Form autoComplete="off" noValidate onSubmit={handleSubmit} >
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Product ID"
                      {...getFieldProps('id')}
                      error={Boolean(touched.id && errors.id)}
                      helperText={touched.id && errors.id}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Name"
                      {...getFieldProps('pro_name')}
                      error={Boolean(touched.pro_name && errors.pro_name)}
                      helperText={touched.pro_name && errors.pro_name}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Type"
                      {...getFieldProps('pro_type')}
                      error={Boolean(touched.pro_type && errors.pro_type)}
                      helperText={touched.pro_type && errors.pro_type}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Price"
                      {...getFieldProps('price')}
                      error={Boolean(touched.price && errors.price)}
                      helperText={touched.price && errors.price}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Item"
                      {...getFieldProps('pro_item')}
                      error={Boolean(touched.pro_item && errors.pro_item)}
                      helperText={touched.pro_item && errors.pro_item}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-simple-select-label"
                        error={Boolean(touched.pro_status && errors.pro_status)}
                      >
                        Product status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Product Status"
                        defaultValue=""
                        {...getFieldProps('pro_status')}
                        error={Boolean(touched.pro_status && errors.pro_status)}
                      >
                        <MenuItem key={0} value="Active" onClick={() => setDropDownValue('Active')}>
                          Active
                        </MenuItem>
                        <MenuItem key={1} value="Banned" onClick={() => setDropDownValue('Banned')}>
                          Banned
                        </MenuItem>
                      </Select>
                      <FormHelperText error={Boolean(touched.pro_status && errors.pro_status)}>
                        {touched.pro_status && errors.pro_status}
                      </FormHelperText>
                    </FormControl>
                  </Grid>


                  <DialogActions sx={{ mt: 3, marginLeft: 39 }}>
                    <Button variant="outlined" autoFocus onClick={onClose} color={"info"}>
                      Close
                    </Button>
                    <Button type="submit" variant="contained" autoFocus color={"info"}>
                      {id !== '' ? 'Edit' : 'Add Product'}
                    </Button>
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