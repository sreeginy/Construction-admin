import { Box, Button, TextField,  Dialog,
    FormControl,
    Autocomplete } from "@mui/material";
import { Form, FormikProvider, useFormik } from 'formik';
import * as yup from "yup";
import * as React from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import PropTypes from 'prop-types';
import DialogContent from '@mui/material/DialogContent';

// validation
AddEditCustomerPopUp.propTypes = {
    onClose: PropTypes.func,
    data: PropTypes.object,
    title: PropTypes.string
  };

const initialValues = {
    id: "",
    name: "",
    address: "",
    userEmail: "",
    contact: "",
}

export default function AddEditCustomerPopUp(props) {
    const { data, onClose } = props;
    const [roleData, setRoleData] = React.useState(data);
    const { id, name, address, userEmail, contact } = roleData;
    const [projectNameList, setProjectStatusList] = React.useState([]);


const AddSchema = yup.object().shape({
    id: yup.string().required("required"),
    name: yup.string().required("required"),
    address: yup.string().email("invalid email").required("required"),
    userEmail: yup.string().required("required"),
    contact: yup.string().required("required"),
});

const formik = useFormik({
    initialValues: {
      id,  
      name,
      address,
      userEmail,
      contact,
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

        <Header
            title="CREATE USER"
            subtitle="Create a New User Profile" />

      <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate >
            <DialogContent>
              <div>

            <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      disableClearable
                    //   options={libraryList}
                    //  {...getFieldProps('_id')}
                    //   onChange={(event, newValue) => setFieldValue('id', newValue)}
                      getOptionLabel={(option) => option.title}
                      renderInput={(params) => <TextField {...params} label="Project ID" />}
                    />
         
                  </FormControl>
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      disableClearable
                      options={projectNameList}
                       {...getFieldProps('name')}
                       onChange={(event, newValue) => setFieldValue('name', newValue)}
                      getOptionLabel={(option) => option.platDisplayName}
                      renderInput={(params) => <TextField {...params} label="Name" />}
                    />
            
                  </FormControl>
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      disableClearable
                    //   options={platfromList}
                    //   {...getFieldProps('type')}
                    //   onChange={(event, newValue) => setFieldValue('type', newValue)}
                      getOptionLabel={(option) => option.platDisplayName}
                      renderInput={(params) => <TextField {...params} label="type" />}
                    />
            
                  </FormControl>
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      disableClearable
                    //   options={pitchStatusList}
                    //   {...getFieldProps('description')}
                    //   onChange={(event, newValue) => setFieldValue('description', newValue)}
                      getOptionLabel={(option) => option.status}
                      renderInput={(params) => <TextField {...params} label="description" />}
                    />
                
                  </FormControl>
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      disableClearable
                    //   options={platfromList}
                    //   {...getFieldProps('isVerified')}
                    //   onChange={(event, newValue) => setFieldValue('isVerified', newValue)}
                      getOptionLabel={(option) => option.platDisplayName}
                      renderInput={(params) => <TextField {...params} label="isVerified" />}
                    />
            
                  </FormControl>
                </Box>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="combo-box-demo"
                      disableClearable
                    //   options={platfromList}
                    //   {...getFieldProps('status')}
                    //   onChange={(event, newValue) => setFieldValue('status', newValue)}
                      getOptionLabel={(option) => option.platDisplayName}
                      renderInput={(params) => <TextField {...params} label="status" />}
                    />
            
                  </FormControl>
                </Box>
                    <Box display="flex" justifyContent="end" mt="50px">

                        <Button type="submit" color="secondary" variant="contained">
                            Create New User
                        </Button>

                    </Box>
                    </div>
            </DialogContent>

            </Form>
        </FormikProvider>
        </Dialog>
        </div>
  );
}

// export default Form;