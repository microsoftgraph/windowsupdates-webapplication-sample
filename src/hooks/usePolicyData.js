import React, { useEffect, useState } from "react";
import { getMembersFromAudienceId } from "../api/getMembers";
import { getPolicies } from "../api/getPolicies";
import { dssEndpoint } from "../config/Constants";
import { GetHeaders, GetToken } from "../utils/fetchHelper";

import { useMsal } from "@azure/msal-react";

// Move to constants file
const UPDATE_POLICIES_ENDPOINT = "/updatePolicies?$expand=audience";
const GET_MEMBERS_ENDPOINT = "/deploymentAudiences";

function usePolicyData() {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [policyToMembers, setPolicyToMembers] = useState([]);
  // TOKEN VARIABLES
  const { instance, accounts } = useMsal();

  // Helper funcion for retriving name from local storage
  function getPolicyNameFromLocalStrage(id) {
    if (localStorage.getItem(id) != null) {
      return localStorage.getItem(id);
    } else {
      localStorage.setItem(id, id);
      return id;
    }
  }

  // Set up policies data to add members and locally stored policy name
  // To do: Later version of graph API will have policy name stored so no need to store on local
  async function setPoliciesData(policies) {
    const tmpPolicies = policies.map(async (policy) => {
      policy.Name = getPolicyNameFromLocalStrage(policy.id);
      try {
        policy.members =
          policy.audience && policy.audience.id
            ? await getMembersFromAudienceId(policy.audience.id)
            : [];
      } catch (err) {
        console.error("Error: " + err);
      }
      return policy;
    });
    return Promise.all(tmpPolicies);
  }

  function setPolicyToMemebersData(policies) {
    // Set policyToMembers state
    const tmpPolicyToMembers = {};
    for (let i = 0; i < policies.length; i++) {
      let item = policies[i];
      tmpPolicyToMembers[item.id] = item.members;
    }
    setPolicyToMembers(tmpPolicyToMembers);
  }

  async function refreshPolicy(policyToRefresh) {
    // Set time out because we want to wait some time before refreshing data using api calls. E.g. After delete call, might as well wait 1 second for bakcend to be updated.
    setTimeout(async () => {
      let tmpPolicy = [...policies];
      let newMembers = [];
      tmpPolicy.map(async (policy) => {
        // Refresh only policy of interest
        if (policy.id == policyToRefresh) {
          policy.Name = getPolicyNameFromLocalStrage(policy.id);
          try {
            policy.members =
              policy.audience && policy.audience.id
                ? await getMembersFromAudienceId(policy.audience.id)
                : [];
            newMembers = policy.members;
          } catch (err) {
            console.error("Error: " + err);
          }
          setPolicyToMembers({
            ...policyToMembers,
            [policyToRefresh]: newMembers,
          });
        }
        return policy;
      });

      await Promise.all(tmpPolicy).then(() => {
        setPolicies(tmpPolicy);
      });
    }, 500);
  }

  // Refresh policy data
  async function refreshPolicyData() {
    setIsLoading(true);
    GetToken(instance, accounts);
    const retrivedPolicies = await getPolicies();
    const policiesData = await setPoliciesData(retrivedPolicies);
    setPolicyToMemebersData(policiesData);
    setPolicies(policiesData);
    setIsLoading(false);
  }

  useEffect(() => {
    async function prepareData() {
      setIsLoading(true);
      GetToken(instance, accounts);
      const retrivedPolicies = await getPolicies();
      const policiesData = await setPoliciesData(retrivedPolicies);
      setPolicyToMemebersData(policiesData);
      setPolicies(policiesData);
      setIsLoading(false);
    }
    prepareData();
    return () => {
      setPolicies([]);
      setPolicyToMembers([]);
    };
  }, []);

  return [
    policies,
    isLoading,
    refreshPolicyData,
    refreshPolicy,
    policyToMembers,
  ];
}

export default usePolicyData;
