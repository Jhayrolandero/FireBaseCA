import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './components/ErrorPage.tsx';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
          path: "/home",
          element: <Home/>
      },
    ]
  },
  {
    path: '/login',
    element: <Login/>,
    errorElement: <ErrorPage/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)
