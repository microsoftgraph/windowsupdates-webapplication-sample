import React from "react";
import { Spinner } from "react-bootstrap";

var stylingObj = {
  display: "block",
  position: "fixed",
  zIndex: 9999,
  top: "50%",
  right: "50%",
};

function SpinnerCommon() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <Spinner animation="border" style={stylingObj} />
    </div>
  );
}

export default SpinnerCommon;
