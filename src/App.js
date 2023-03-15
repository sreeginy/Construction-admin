import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/globel/Topbar";
import Sidebar from "./scenes/globel/sidebar";
import Dasshboard from "./scenes/dashboard";
import Team from "./scenes/team/index";
import Products from "./scenes/products/index";
import Form from "./scenes/form/index";
import User from "./scenes/user/index";
import LoginPage from './scenes/LoginPage';
import Register from './scenes/Register';


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
            <Route path="/team" element={<Team />} />
            <Route path="/products" element={<Products />} />
            <Route path="/form" element={<Form />} />
            <Route path="/user" element={<User />} />
        </Routes>
      </main>
   </div>
   </ThemeProvider>
   </ColorModeContext.Provider>
   );



}

export default App;
