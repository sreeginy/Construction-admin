import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Card, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import AuthLayout from '../../src/layouts/AuthLayout';
import Page from '../components/Page';
import Iconify from '../components/iconify';
// sections
import { RegisterForm } from '../sections/auth/register';
import  AuthSocial from '../sections/auth/AuthSocial';
import { Link as RouterLink } from 'react-router-dom';
// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({

  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '70vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));



// ----------------------------------------------------------------------

export default function Register() {
  const mdUp = useResponsive('up', 'md');

  return (
   <>

    <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              RK ARCHITECTURE DESIGNERS AND ENGINEERS
              {/* Get started absolutely free. */}
            </Typography>
            {/* <Typography sx={{ color: 'text.secondary' }}>
              Free forever. No credit card needed.
            </Typography> */}
          </Box>

          <AuthSocial />

          <RegisterForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            By registering, I agree to RK Construction&nbsp;
            <Link underline="always" color="textPrimary">
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link underline="always" color="textPrimary">
              Privacy Policy
            </Link>
            .
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              mt: 3,
              textAlign: 'center',
              display: { sm: 'none' }
            }}
          >
            Already have an account?&nbsp;
           <NavLink to="/login">Login</NavLink>

            <Link underline="hover" to="/login" component={RouterLink}>
              Login
            </Link>
          </Typography>
        </ContentStyle>
      </Container>

        </>

  );
}
