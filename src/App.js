import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/globel/Topbar";
import Sidebar from "./scenes/globel/sidebar";
import Dasshboard from "./scenes/dashboard";
import Team from "./scenes/team/index";
import Products from "./scenes/products/index";
// import Invoices from "./scenes/invoices";
// import Contacts from "./scenes/contacts";


function App() {
  const [theme, colorMode] = useMode();



  return ( <ColorModeContext.Provider value={colorMode}> 
  <ThemeProvider theme={theme}>
    <CssBaseline/>
   <div className="app">
        <Sidebar />
      <main className="content">
        <Topbar />
        <Routes>
            <Route path="/" element={<  Dasshboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/products" element={<Products />} />
            {/* <Route path="/contacts" element={<Contacts />} /> */}
            {/* <Route path="/invoices" element={<Invoices />} /> */}
        </Routes>
      </main>
   </div>
   </ThemeProvider>
   </ColorModeContext.Provider>
   );



}

export default App;
