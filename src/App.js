import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
// import Topbar from "./scenes/globel/Topbar";
// import Sidebar from "./scenes/globel/sidebar";
import Router from './routes';

function App() {
  const [theme, colorMode] = useMode();



  return ( <ColorModeContext.Provider value={colorMode}> 
  <ThemeProvider theme={theme}>
    <CssBaseline/>
   <div className="app">
        {/* <Sidebar />
      <main className="content">
        <Topbar /> */}
        <Router />
        {/* <Routes>
            <Route path="/login" element={<  LoginPage />} />
            <Route path="/register" element={< Register />} />
            <Route path="/dashboard" element={<  Dasshboard />} />
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
      {/* </main> */}
   </div>
   </ThemeProvider>
   </ColorModeContext.Provider>
   );



}

export default App;
