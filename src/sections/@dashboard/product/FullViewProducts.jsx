import * as React from 'react';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Dialog, DialogContent, useTheme, DialogTitle, DialogActions, Button } from '@mui/material';


// Toast
import { toast } from 'react-toastify';
import messageStyle from '../../../components/toast/toastStyle';


// validation
FullViewProducts.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  code: PropTypes.string,
  name: PropTypes.string
};
export default function FullViewProducts(props) {
  const theme = useTheme();
  const { data, onClose } = props;
  console.log(data);

  const placeholder = '/static/placeholder.jpg';

  const fullData = [
    {
      id: data?.id || '',
      pro_name: data?.pro_name || '',
      pro_type: data?.pro_type || '',
      price: data?.price || '',
      pro_item: data?.pro_item || '',
      pro_status: data?.pro_status || '',
   

    }
];

const notifySuccess = (msg) => toast.success(msg, messageStyle);
return (
  <div>
    <Dialog
      fullWidth
      maxWidth="xm"
      open
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title" align="center" >
        Product Details - {data?.pro_name}
        <DialogActions>
          <Button variant="gray" autoFocus onClick={onClose}>
            Back
          </Button>
        </DialogActions>
      </DialogTitle>

      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead sx={{ backgroundColor: 'gray' }}>
              <TableRow>
                <TableCell>Heading</TableCell>
                <TableCell align="left">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                
              {fullData.map((row) => (
                
                <>
                  {data?.id ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Product ID
                      </TableCell>
                      <TableCell align="left">{row.id}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.pro_name ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Product Name
                      </TableCell>
                      <TableCell align="left">{row.pro_name}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}    

                  {data?.pro_type ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Product Type
                      </TableCell>
                      <TableCell align="left">{row.pro_type}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.price ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Price
                      </TableCell>
                      <TableCell align="left">{row.price}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.pro_item ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Product Item
                      </TableCell>
                      <TableCell align="left">{row.pro_item}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.pro_status ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Product Status
                      </TableCell>
                      <TableCell align="left">{row.pro_status}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}
                
           

</>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
