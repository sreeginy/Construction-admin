
import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, useTheme } from '@mui/material';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Header from "../../components/Header";
// const styledBox = styled(Box)``;


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);



  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
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
        <IconButton onClick={handleOpen}>
          <AccountCircleOutlinedIcon />

          <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            Username
            {/* {account.displayName} */}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {/* {account.email} */}
          </Typography>
        </Box>
  

        <MenuItem onClick={handleClose} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>

        </IconButton>
      </Box>
     </Box>
  );
};

export default Topbar;