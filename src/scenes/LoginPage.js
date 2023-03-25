
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Card, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
import Iconify from '../components/iconify';
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

// const StyledContent = styled('div')(({ theme }) => ({
//   maxWidth: 480,
//   margin: 'auto',
//   minHeight: '100vh',
//   display: 'flex',
//   justifyContent: 'center',
//   flexDirection: 'column',
//   padding: theme.spacing(12, 0),
// }));



const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '70vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(10, 0),

}));
// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      {/* <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet> */}



      <Container maxWidth="sm">

        <Card >
          <ContentStyle>
            <Typography variant="h3" justifyContent="center" gutterBottom color="#ffffff" p={2}>
              RK Architecture Designers And Engineers
            </Typography>
            <Typography variant='h4'>
              Sign In
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link variant="subtitle2">Get started</Link>
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:google-fill" color="#DF3E30" width={18} height={18} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={18} height={18} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={18} height={18} />
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <LoginForm />
          </ContentStyle>
        </Card>

      </Container>

    </>
  );
}
