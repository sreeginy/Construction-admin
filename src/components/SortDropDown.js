import PropTypes from 'prop-types';
// material
import { MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react';

// ----------------------------------------------------------------------

SortDropDown.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func
};

export default function SortDropDown({ options, onSort }) {
  const [dataValue, setValue] = useState(options[0].value);

  // React.useEffect(() => {
  //   setValue(options[0].value);
  // }, [options]);
  const setDropDownValue = (value) => {
    setValue(value);
    onSort(value);
  };

  return (
    <TextField select size="small" value={dataValue}>
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          onClick={() => setDropDownValue(option.value)}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
