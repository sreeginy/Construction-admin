import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import * as React from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import PropTypes from 'prop-types';

// validation
AddEditProjectPopUp.propTypes = {
    onClose: PropTypes.func,
    data: PropTypes.object,
    title: PropTypes.string
  };

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
}

export default function AddEditProjectPopUp(props) {
    const { data, onClose } = props;
    const [roleData, setRoleData] = React.useState(data);
    const {  id, name, type, status, description, avatarUrl, isVerified, } = roleData;
    const [value, setValue] = React.useState(null);
    const [libraryList, setLibraryList] = React.useState([]);
    const [platfromList, setPlatfromList] = React.useState([]);
    const [pitchStatusList, setPitchStatusList] = React.useState([]);


   

const userSchema = yup.object().shape({
    id: yup.string().required("required"),
    name: yup.string().required("required"),
    type: yup.string().email("invalid email").required("required"),
    status: yup.string().required("required"),
    description: yup.string().required("required"),
});



const Form = () => {
    const isNonMobile = useMediaQuery("(min-width:600px");

    const handleFormSubmit = (values) => {
        console.log(values);
    };

    return (<Box m="20px">

        <Header
            title="CREATE USER"
            subtitle="Create a New User Profile" />

        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={userSchema}
        >

            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>

                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="First Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            error={!!touched.firstName && !!errors.firstName}
                            helperText={touched.firstName && errors.firstName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName"
                            error={!!touched.lastName && !!errors.lastName}
                            helperText={touched.lastName && errors.lastName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={!!touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Contact"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.contact}
                            name="contact"
                            error={!!touched.contact && !!errors.contact}
                            helperText={touched.contact && errors.contact}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.address}
                            name="address"
                            error={!!touched.address && !!errors.address}
                            helperText={touched.address && errors.address}
                            sx={{ gridColumn: "span 2" }}
                        />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="50px">

                        <Button type="submit" color="secondary" variant="contained">
                            Create New User
                        </Button>

                    </Box>

                </form>
            )}

        </Formik>

    </Box>

    );
              
};
}
// export default Form;