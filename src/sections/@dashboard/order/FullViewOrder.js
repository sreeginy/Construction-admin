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
FullViewOrder.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.object,
  code: PropTypes.string,
  name: PropTypes.string
};
export default function FullViewOrder(props) {
  const theme = useTheme();
  const { data, onClose } = props;
  console.log(data);

  const placeholder = '/static/placeholder.jpg';

  const fullData = [
    {
      id: data?.id || '',
      customerName: data?.customerName || '',
      deliveryPartnerName: data?.deliveryPartnerName || '',
      products: data?.products || '',
      orderStatus: data?.orderStatus || '',
      deliveryDate: data?.deliveryDate || '',
      deliveryAddress: data?.deliveryAddress || '',
      total: data?.total || '',
    
   

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
        Order Details - {data?.pro_name}
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
                       Order ID
                      </TableCell>
                      <TableCell align="left">{row.id}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.customerName ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                      Customer Name
                      </TableCell>
                      <TableCell align="left">{row.customerName}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}    

                  {data?.deliveryPartnerName ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                      Delivery Partner
                      </TableCell>
                      <TableCell align="left">{row.deliveryPartnerName}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.products ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                      Products
                      </TableCell>
                      <TableCell align="left">{row.products}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.orderStatus ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                      Order Status
                      </TableCell>
                      <TableCell align="left">{row.orderStatus}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

                {data?.deliveryDate ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                      Delivery Date
                      </TableCell>
                      <TableCell align="left">{row.deliveryDate}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

{data?.deliveryAddress ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                      Delivery Address
                      </TableCell>
                      <TableCell align="left">{row.deliveryAddress}</TableCell>
                    </TableRow>
                  ) : (
                    ''
                  )}

{data?.total ? (
                    <TableRow>
                      <TableCell component="th" scope="row">
                      Total
                      </TableCell>
                      <TableCell align="left">{row.total}</TableCell>
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
