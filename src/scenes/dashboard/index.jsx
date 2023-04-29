
import { faker } from '@faker-js/faker';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import Iconify from '../../components/iconify';
import { grey } from '@mui/material/colors';
import { useState, useEffect } from 'react';
// Api Call
import apiClient from '../../api/apiClient';
import headers from '../../api/apiHeader';
import apiHandleError from '../../api/apiHandleError';
import {
AppWidgetSummary,
} from '../../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [orderCount, setOrderCount] = useState();
  const [productCount, setProductCount] = useState();
  const [projectCount, setProjectCount] = useState();
  const [appointmentCount, setAppointmentCount] = useState();


  useEffect(() => {
    getProjectCount();
    getProductCount();
    getOrderCount();
    getAppointment();
  }, []);

        /* API GET ALL order */
        const getAppointment = async () => {
          try {
            const response = await apiClient.get('appointment/count', {
              headers: headers()
            });
            if (response.status === 200) {
              setAppointmentCount(response.data);
            } else {
              apiHandleError(response);
            }
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        };
        /* API GET ALL order */
        const getOrderCount = async () => {
          try {
            const response = await apiClient.get('orders/count', {
              headers: headers()
            });
            if (response.status === 200) {
              setOrderCount(response.data);
            } else {
              apiHandleError(response);
            }
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        };

    /* API GET ALL product */
    const getProductCount = async () => {
      try {
        const response = await apiClient.get('product/count', {
          headers: headers()
        });
        if (response.status === 200) {
          setProductCount(response.data);
        } else {
          apiHandleError(response);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
  
  /* API GET ALL project */
  const getProjectCount = async () => {
    try {
      const response = await apiClient.get('project/count', {
        headers: headers()
      });
      if (response.status === 200) {
        setProjectCount(response.data);
      } else {
        apiHandleError(response);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h2" sx={{ mb: 5 }} textAlign={'center'}>
          RK&nbsp; ARCHITECTURE&nbsp; DESIGNERS&nbsp; AND&nbsp; ENGINEERS
        </Typography>
        <Typography variant="h4" sx={{ mb: 5 }} color={grey} marginTop={10}>
         Hi, Welcome back!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Orders - RK YARD" total={orderCount} icon={'carbon:order-details'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Product - RK YARD" total={productCount} color="info" icon={"material-symbols:production-quantity-limits"} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Appointments - RK Construction" total={appointmentCount} color="success" icon={'teenyicons:appointments-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Projects - RK Construction" total={projectCount} color="error" icon={'icon-park-solid:building-two'} />
           
          </Grid>   
        </Grid>
      </Container>
    </>
  );
}
