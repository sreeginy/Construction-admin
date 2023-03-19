import { Navigate, useRoutes } from 'react-router-dom';


import Dashboard from "./scenes/dashboard";
import User from "./scenes/user/index";
import Products from "./scenes/products/index";
import Form from "./scenes/form/index";
import Customer from "./scenes/customer/index";
import Login from './scenes/LoginPage';
import Register from './scenes/Register';
import Order from './scenes/order';
import Project from './scenes/project';
import Material from './scenes/material';
import Account from './scenes/account';
import Employee from './scenes/employee';
import Role from './scenes/role';


// ----------------------------------------------------------------------
function PrivateRoute({ auth: { isAuthenticated }, children }) {
    return isAuthenticated ? children : <Navigate to="/login" />;
  }
  function SessionRoute({ auth: { isAuthenticated }, children }) {
    return !isAuthenticated ? children : <Navigate to="/dashboard/app" />;
  }
  export default function Router() {
    const getUser = () => {
      const USER = JSON.parse(localStorage.getItem('user'));
      if (USER !== null) {
        return true;
      }
      return false;
    };
    return useRoutes([
      {
        path: '/dashboard',
        element: (
          <PrivateRoute auth={{ isAuthenticated: getUser() }}>
            {/* <DashboardLayout /> */}
          </PrivateRoute>
        ),
        children: [

            { path: 'app', element: <Dashboard /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'products', element: <Products /> },
            { path: 'customer', element: <Customer /> },
            { path: 'order', element: <Order /> },
            { path: 'project', element: <Project /> },
            { path: 'material', element: <Material /> },
            { path: 'account', element: <Account /> },
            { path: 'employee', element: <Employee /> },
            { path: 'user', element: <User /> },
            { path: 'role', element: <Role /> },
   

        ]
    },
    {
      path: '/',
      element: (
        <SessionRoute auth={{ isAuthenticated: getUser() }}>
          {/* <LogoOnlyLayout /> */}
        </SessionRoute>
      ),
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        // { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
