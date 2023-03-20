
import { Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import Dashboard from "./scenes/dashboard";
import User from "./scenes/user/index";
import Products from "./scenes/products";
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

export default function Router() {
   

    const routes = useRoutes([
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="/dashboard/app" />, index: true },
          { path: 'app', element: <Dashboard /> },
          { path: 'user', element: <User /> },
          { path: 'products', element: <Products /> },
          { path: 'customer', element: <Customer /> },
        ],
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    //   {
    //     element: <SimpleLayout />,
    //     children: [
    //       { element: <Navigate to="/dashboard/app" />, index: true },
    //       { path: '404', element: <Page404 /> },
    //       { path: '*', element: <Navigate to="/404" /> },
    //     ],
    //   },
    //   {
    //     path: '*',
    //     element: <Navigate to="/404" replace />,
    //   },
    ]);

 
 
  
    return routes;
  }