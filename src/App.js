import React from "react"; //MIT LICENSE < https://github.com/facebook/react/ >
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react"; //MIT LICENSE < https://github.com/AzureAD/microsoft-authentication-library-for-js >
import { BrowserRouter, Routes, Route } from "react-router-dom"; //MIT LICENSE < https://github.com/ReactTraining/react-router#readme >

import LandingPage from "./pages/LandingPage/LandingPage";
import NavigationBar from "./components/navigation/NavigationBar";
import { About } from "./pages/AboutPage/AboutPage";
import DriversAndFirmwarePage from "./pages/DriversAndFirmwarePage/DriversAndFirmwarePage";
import UpdatePage from "./pages/UpdatePage/UpdatePage";

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar>
        <AuthenticatedTemplate>
          <Routes>
            <Route path="/" element={<DriversAndFirmwarePage />} />
            <Route path="/about" element={<About />} />
            {/*<Route path="/about" element={<UpdatePage />} />*/}
            <Route path="/policy/:id" element={<UpdatePage />} />
            {/* <Route path="/policy/:policy" component={Updates} /> */}
          </Routes>
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <LandingPage />
        </UnauthenticatedTemplate>
      </NavigationBar>
    </BrowserRouter>
  );
}
