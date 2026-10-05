import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router"

import App from "./App";
import SetupPage from "./Setup";
import HostLobby from "./Host/Host";
import GuestLobby from "./Guest";
import { DialInput, DialSample } from "./Dial";

const router = createBrowserRouter([
  {
    path: '/',
    element: <SetupPage />
  },
  {
    path: '/host',
    element: <HostLobby />
  },
  {
    path: '/guest',
    element: <GuestLobby />
  },
  {
    path: '/dial',
    element: <DialSample />
  }

])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
