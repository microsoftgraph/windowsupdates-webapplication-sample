import React from "react"; //MIT LICENSE < https://github.com/facebook/react/ >
import Navbar from "react-bootstrap/Navbar"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >
import { Nav, NavDropdown, Container } from "react-bootstrap"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >
import { useIsAuthenticated } from "@azure/msal-react"; //MIT LICENSE < https://github.com/AzureAD/microsoft-authentication-library-for-js >
import { SignInButton } from "../buttons/SingInButton"; //LOCAL FILE
import { SignOutButton } from "../buttons/SignOutButton"; //LOCAL FILE
import { AuthRoleIndicator } from "../AuthRoleIndicator"; //LOCAL FILE
import "bootstrap/dist/css/bootstrap.min.css"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >

const NavigationBar = (props) => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="/">WUfB DS Application</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {isAuthenticated ? (
              <>
                <Nav className="me-auto">
                  <Nav.Link href="/">Drivers and Firmware</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>
                  <AuthRoleIndicator />
                </Nav>
                <Nav className="ml-auto">
                  <SignOutButton />
                </Nav>
              </>
            ) : (
              <SignInButton />
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {props.children}
    </>
  );
};

export default NavigationBar;
