import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
// import Header from '../../scenes/globel/Topbar';
// import Nav from '../../scenes/globel/sidebar';
import { ColorModeContext, useMode } from '../../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "../../scenes/globel/Topbar";
import Sidebar from "../../scenes/globel/sidebar";
// ----------------------------------------------------------------------



const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));


// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);


   return (
   // <ColorModeContext.Provider value={colorMode}> 
  //   <ThemeProvider theme={theme}>
  //     <CssBaseline/>
      <>
     <div className="app">
          <Sidebar />
        <main className="content">
          <Topbar />

    <StyledRoot>
      {/* <Topbar onOpenNav={() => setOpen(true)} />

      <Sidebar openNav={open} onCloseNav={() => setOpen(false)} /> */}

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>


    </main>
   </div>

   </>
  //  </ThemeProvider>
  //  </ColorModeContext.Provider>
  );
}
