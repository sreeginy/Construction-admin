import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/globel/Topbar";
import Sidebar from "./scenes/globel/sidebar";
import Dasshboard from "./scenes/dashboard";
import Role from "./scenes/role/index";
import Products from "./scenes/products/index";
import Form from "./scenes/form/index";
import Customer from "./scenes/customer/index";
import LoginPage from './scenes/LoginPage';
import Register from './scenes/Register';
import Order from './scenes/order';
import Project from './scenes/project';
import Material from './scenes/material';

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
            <Route path="/login" element={<  LoginPage />} />
            <Route path="/register" element={< Register />} />
            <Route path="/dashboard" element={<  Dasshboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/order" element={<Order />} />
            <Route path="/project" element={<Project />} />
            <Route path="/material" element={<Material />} />

            <Route path="/team" element={<Role />} />
        
            <Route path="/form" element={<Form />} />
           
        </Routes>
      </main>
   </div>
   </ThemeProvider>
   </ColorModeContext.Provider>
   );



}

export default App;
