import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
// import DashboardNavbar from './DashboardNavbar';
// import DashboardSidebar from './DashboardSidebar';

import Topbar from "../../scenes/globel/Topbar";
import Sidebar from "../../scenes/globel/sidebar";
import { ColorModeContext, useMode } from '../../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
// ----------------------------------------------------------------------




const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <>

      <CssBaseline/>
     <div className="app">
          <Sidebar />
        <main className="content">
          <Topbar />


    <RootStyle>
      <Topbar onOpenSidebar={() => setOpen(true)} />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>

    </main>
   </div>
</>
   
  );
}

