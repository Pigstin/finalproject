import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router"

import SetupPage from "./Setup";
import HostLobby from "./Host/Host";
import GuestLobby from "./Guest";
import { DialInput, DialSample } from "./analog player/Dial";
import WaveBox from "./analog player/Wavebox";
import CharlotteTestZone from "./CharlotteTestZone";
import DigitalPage from './digital/digital'

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
    //element: <DialInput minVal={-50} maxVal={50} valueModifier={() => { }} />
  },
  {
    path: '/wave',
    element: <WaveBox />
  },
  {
    path: '/charlotteTest',
    element: <CharlotteTestZone />
  }, 
  {
    path: '/digital',
    element: <DigitalPage/>
  }

  // https://reactrouter.com/start/data/route-object
  // look into loader for loading data from database? 

])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
