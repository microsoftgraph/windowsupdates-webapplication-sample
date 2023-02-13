import React from "react"; //MIT LICENSE < https://github.com/facebook/react/ >
import { Container, Row, Col, Image } from "react-bootstrap"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >
import logo from "../../assets/WindowsLogo.png"; //LOCAL FILE

import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="va-content">
      <Row>
        <Col xl={6}>
          <Image className="logo w-50" src={logo} fluid />
        </Col>
        <Col className="text-content col-6">
          <h1>Windows Update for Business</h1>
          <h3>
            <i>Deployment Service Application</i>
          </h3>
          <h3>
            <i>v5.0</i>
          </h3>
        </Col>
      </Row>
    </div>
  );
}
