import { useState } from "react";
import { ProSidebar, Menu, MenuItem} from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Item = ({ tittle, to, icon, selected, setSelected}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem active={selected === tittle} style={{ color: colors.grey[100]}} onClick={() => setSelected(tittle)} icon={icon} >
        <Typography variant="h5" >{tittle}</Typography>
        <Link to={to} />
        </MenuItem>
    )
}

const Sidebar = ()  => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (

        <Box
        sx={{
            "& .pro-sidebar-inner": {
                background: `${colors.primary[400]} !important`
            },
            "& .pro-icon-wrapper": {
                backgroundColor: "transparent !important"
            },
            "& .pro-inner-item": {
                padding: "0px 35px 5px 20px !important"
            },
            "& .pro-inner-item:hover": {
                color: "#87CEFA !important"
            },
            "& .pro-menu-item.active": {
                color: "#6870fa !important"
            },

        }}
        >
        <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]} >
                  ADMINIS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

                {!isCollapsed && (
                    <Box mb="35px">
                        <Box display="flex" justifyContent="center" alignItems="center">
                        <img
                           alt="profile-user"
                           width="100px"
                           height="100px"
                           src={`../../assets/user.png`}
                           style={{ cursor: "pointer", borderRadius: "50%" }}
                        />
                        </Box>

                        <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Sreeginy K
                </Typography>
                <Typography variant="h6" color={colors.greenAccent[500]}>
                  web Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box  paddingLeft={isCollapsed ? undefined : "10%"}>
                <Item
                    tittle="Dashboard"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                
                ></Item>

                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px"}}>
                 
                Data </Typography>

                 <Item
                    tittle="Manage Team"
                    to="/team"
                    icon={<PermIdentityOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                
                ></Item>
                 <Item
                    tittle="Products"
                    to="/products"
                    icon={<ContactPhoneOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                
                ></Item>

                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px"}}>
                 
                Data </Typography>
                
                  <Item
                    tittle="Users"
                    to="/users"
                    icon={<PeopleAltOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                
                ></Item>
          </Box>



          </Menu>
          </ProSidebar>
        </Box>
        
    );
};

export default Sidebar;