import { useState, useEffect } from "react";
import { dssEndpoint } from "../config/Constants";
import axios from "axios";
import { useMsal } from "@azure/msal-react";
import { wufbRequest } from "../config/AuthConfig";

const useFetch = (url) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState();
  const [loadingStatus, setLoadingStatus] = useState(true);

  // TOKEN VARIABLES
  const { instance, accounts } = useMsal();

  function getHeaders() {
    return {
      Authorization: `Bearer ${sessionStorage.getItem("Access Token")}`,
      "Content-Type": "application/json",
      tid: sessionStorage.getItem("Tenant ID"),
    };
  }

  function GetToken() {
    instance
      .acquireTokenSilent({
        ...wufbRequest,
        account: accounts[0],
      })
      .then((response) => {
        sessionStorage.setItem("Access Token", response.accessToken);
        sessionStorage.setItem("Tenant ID", response.tenantId);
      });
  }

  async function refreshData() {
    setLoadingStatus(true);
    try {
      let apiConfig = {
        headers: getHeaders(),
      };
      setLoadingStatus(true);
      const results = await axios.get(dssEndpoint + url, apiConfig);
      setData(results.data.value);
      setLoadingStatus(false);
    } catch (e) {
      setError(e);
      setLoadingStatus(false);
    }
  }

  useEffect(() => {
    GetToken();
    async function getData() {
      setLoadingStatus(true);
      try {
        let apiConfig = {
          headers: getHeaders(),
        };
        setLoadingStatus(true);
        const results = await axios.get(dssEndpoint + url, apiConfig);
        setData(results.data.value);
        setLoadingStatus(false);
      } catch (e) {
        setError(e);
        setLoadingStatus(false);
      }
    }
    getData();
  }, []);

  return [data, loadingStatus, error, refreshData];
};

export default useFetch;
