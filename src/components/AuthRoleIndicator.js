import React, { useEffect, useState } from "react"; //MIT LICENSE < https://github.com/facebook/react/ >
import Button from "react-bootstrap/Button"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >
import { BsAlarm, BsCheck, BsExclamation, BsLock } from "react-icons/bs"; //MIT LICENSE < https://github.com/twbs/icons >
import { AiOutlineWarning } from "react-icons/ai"; //MIT LICENSE < https://github.com/twbs/icons >
import jwt_decode from "jwt-decode"; //MIT LICENSE < https://github.com/auth0/jwt-decode >

export const AuthRoleIndicator = () => {
  const [isIntuneAdmin, setIsIntuneAdmin] = useState(false);
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);

  const determineRoles = async () => {
    var decodedToken = jwt_decode(sessionStorage.getItem("Access Token"));
    setIsIntuneAdmin(
      decodedToken.wids.includes("3a2c62db-5318-420d-8d74-23affee5d9d5")
    ); //INTUNE ADMIN ROLE (AZURE AD)
    setIsGlobalAdmin(
      decodedToken.wids.includes("62e90394-69f5-4237-9190-012177145e10")
    ); //GLOBAL ADMIN ROLE (AZURE AD)
  };

  useEffect(() => {
    setTimeout(() => determineRoles(), 1500);
  }, []);

  return (
    <>
      {isIntuneAdmin || isGlobalAdmin ? (
        <Button className="btn p-2 btn-sm" variant="outline-secondary">
          <BsLock /> Authenticated
        </Button>
      ) : (
        <Button className="btn p-2 btn-sm" variant="outline-danger">
          <AiOutlineWarning /> Not Authenticated{" "}
        </Button>
      )}
    </>
  );
};
