import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header";
// const styledBox = styled(Box)``;


    const Topbar = () => {
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const colorMode = useContext(ColorModeContext);

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box
          display="flex"
          borderRadius="3px"
        >
           <Header title="" Color={colors.primary[400]}/> 
          
        </Box>

   {/* ICONS */}
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
        <IconButton>
          <AccountCircleOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};



export default Topbar;