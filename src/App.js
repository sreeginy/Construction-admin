import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/globel/Topbar";
import Sidebar from "./scenes/globel/sidebar";
// import Dashboard from "./scenes/dashboard";
// import User from "./scenes/user/index";
// import Products from "./scenes/products";
// import Form from "./scenes/form/index";
// import Customer from "./scenes/customer/index";
// import Login from './scenes/LoginPage';
// import Register from './scenes/Register';
// import Order from './scenes/order';
// import Project from './scenes/project';
// import Material from './scenes/material';
// import Account from './scenes/account';
// import Employee from './scenes/employee';
// import Role from './scenes/role';

import Router from './routes';


function App() {
  const [theme, colorMode] = useMode();



  return ( <ColorModeContext.Provider value={colorMode}> 
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Router />
    <>
   {/* <div className="app">
        <Sidebar />
      <main className="content">
        <Topbar />  */}
     
        {/* <Routes>
            <Route path="/login" element={<  Login />} />
            <Route path="/register" element={< Register />} />
            <Route path="/dashboard" element={<  Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/order" element={<Order />} />
            <Route path="/project" element={<Project />} />
            <Route path="/material" element={<Material />} />
            <Route path="/account" element={<Account />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/user" element={<User />} />
            <Route path="/role" element={<Role />} />
        
            <Route path="/form" element={<Form />} />
           
        </Routes> */}
      {/* </main>
   </div>  */}

   </>
   </ThemeProvider>
   </ColorModeContext.Provider>
   );



}

export default App;
