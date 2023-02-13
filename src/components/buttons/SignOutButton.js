import React from "react"; //MIT LICENSE < https://github.com/facebook/react/ >
import { useMsal } from "@azure/msal-react"; //MIT LICENSE < https://github.com/AzureAD/microsoft-authentication-library-for-js >
import Button from "react-bootstrap/Button"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >

export const SignOutButton = () => {
  const { instance } = useMsal();
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        instance.logout();
        sessionStorage.clear();
      }}
    >
      Sign Out
    </Button>
  );
};
