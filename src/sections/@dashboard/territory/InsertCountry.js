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
  Chip,
  OutlinedInput,
  MenuItem,
  Stack,
  useTheme,
  FormHelperText
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
// Api Call
import apiClient from '../../../../api/apiClient';
import headers from '../../../../api/apiHeader';
import messageStyle from '../../../../components/toast/toastStyle';
import apiHandleError from '../../../../api/apiHandleError';

// validation
InsertCountryPopUp.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  name: PropTypes.string
};

function getStyles(name, countriesNames, theme) {
  return {
    fontWeight:
      countriesNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function InsertCountryPopUp(props) {
  const theme = useTheme();
  const { data, onClose, onSuccess } = props;
  const [territory, setTerritory] = React.useState(data);
  const [countryList, setCountryList] = useState([]);
  const [countriesNames, setCountriesNames] = useState([]);

  // Validations
  const AddSchema = Yup.object().shape({
    countriesNames: Yup.string().required('select countries')
  });

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setCountriesNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    console.log(event);
  };

  const onDeleteHandle = (chipToDelete) => () => {
    console.log(chipToDelete);
    setCountriesNames((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const formik = useFormik({
    initialValues: {
      country: territory?.region
    },
    validationSchema: AddSchema,
    onSubmit: () => {
      console.log('onSubmit');
      // updateCountry();
    }
  });

  /* API GET ALL Country */
  const getCountryList = async () => {
    try {
      const response = await apiClient.get('country', {
        headers: headers()
      });
      if (response.status === 200) {
        setCountryList(response.data.country);
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  /* API Update Country */
  const updateCountry = async () => {
    try {
      let finalArray = countryList.map((el2) => ({
        id: el2._id,
        match: countriesNames.some((el1) => el2.countryCode === el1)
      }));
      finalArray = finalArray.map((value) => (value.match === true ? value.id : null));
      finalArray = finalArray.filter((x) => x !== null);
      const oldCountries = territory.countries.map((value) => value._id);
      const merged = finalArray.concat(oldCountries);
      const rawData = {
        region: territory.region,
        countries: merged
      };
      const idValue = territory._id;
      console.log(rawData);
      const response = await apiClient.patch(`territories/${idValue}`, rawData, {
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

  useEffect(() => {
    getCountryList();
  }, []);

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  const notifySuccess = (msg) => toast.success(msg, messageStyle);

  return (
    <div>
      <Dialog maxWidth="md" open onClose={onClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          {data.code !== '' ? 'Edit Country' : 'Add Country'}
        </DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <div>
                <Box sx={({ pb: 3 }, { pt: 3 })}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-multiple-chip-label">Countries</InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={countriesNames}
                      onChange={handleChange}
                      input={<OutlinedInput id="select-multiple-chip" label="Countries" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              onDelete={(value) => onDeleteHandle(value)}
                            />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {countryList.map((country) => (
                        <MenuItem
                          key={country._id}
                          value={country.countryCode}
                          style={getStyles(country.countryCode, countriesNames, theme)}
                        >
                          {country.countryCode}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={onClose}>
                Close
              </Button>
              <LoadingButton
                size="medium"
                variant="contained"
                onClick={() => updateCountry()}
                loading={isSubmitting}
              >
                Add
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
