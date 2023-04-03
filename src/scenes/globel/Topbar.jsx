import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { alpha } from '@mui/material/styles';
import { Box, Button, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, useTheme } from '@mui/material';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Header from "../../components/Header";
// Api Call
import apiClient from '../../api/apiClient';
import headers from '../../api/apiHeader';

// const styledBox = styled(Box)``;


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);


  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const checkClick = () => {
    console.log(`Bearer ${localStorage.getItem('jwt-token')}`);
  };
 

  // logout Api
  const userLogout = async () => {
    localStorage.clear();
    navigate('/', { replace: true });
    // try {
    //   const response = await apiClient.post(
    //     'users/logout',
    //     {},
    //     {
    //       headers: headers()
    //     }
    //   );

    //   if (response.status === 200) {
    //     localStorage.clear();
    //     navigate('/', { replace: true });
    //   }
    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }
  };


  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
    //   //         display="flex"
    //   //         borderRadius="3px"
    //   //       >
    //   //         <input
    //   //  type="text"
    //   //  placeholder="Search here"
    //   // //  onChange={handleChange}
    //   // //  value={searchInput} 
      />
      <Header title="" Color={colors.primary[400]} />



      
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <NightlightOutlinedIcon />
          ) : (
            <LightModeIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsNoneOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton 
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}>
          <AccountCircleOutlinedIcon />

        {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
   

      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Iconify
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))} */}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={() => userLogout()}>
            Logout
          </Button>
        </Box>
      </Popover>
         
         </IconButton>
      </Box>
     </Box>
  );
};

export default Topbar;