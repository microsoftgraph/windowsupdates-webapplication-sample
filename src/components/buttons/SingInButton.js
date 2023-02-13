import React from "react"; //MIT LICENSE < https://github.com/facebook/react/ >
import { useMsal } from "@azure/msal-react"; //MIT LICENSE < https://github.com/AzureAD/microsoft-authentication-library-for-js >
import { wufbRequest } from "../../config/AuthConfig"; //LOCAL FILE
import { Button } from "react-bootstrap"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >

export const SignInButton = () => {
  const { instance } = useMsal();
  const handleLogin = () => {
    instance
      .loginPopup(wufbRequest)
      .then((res) => {
        sessionStorage.setItem("Access Token", res.accessToken);
        sessionStorage.setItem("Tenant ID", res.tenantId);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <Button
      variant="outline-secondary"
      className="ms-auto"
      drop="left"
      title="Sign In"
      onClick={() => handleLogin()}
    >
      Sign In
    </Button>
  );
};
