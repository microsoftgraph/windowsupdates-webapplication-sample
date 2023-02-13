import { wufbRequest } from "../config/AuthConfig";

export const GetHeaders = () => {
  return {
    Authorization: `Bearer ${sessionStorage.getItem("Access Token")}`,
    "Content-Type": "application/json",
    tid: sessionStorage.getItem("Tenant ID"),
  };
};

export const GetToken = (instance, accounts) => {
  instance
    .acquireTokenSilent({
      ...wufbRequest,
      account: accounts[0],
    })
    .then((response) => {
      sessionStorage.setItem("Access Token", response.accessToken);
      sessionStorage.setItem("Tenant ID", response.tenantId);
    });
};
