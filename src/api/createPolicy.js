import axios from "axios";
import { dssEndpoint, entityType } from "../config/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetHeaders } from "../utils/fetchHelper";
import { notify } from "../utils/notify";

// Create Policy helper function which creates the audience first and then create policy
export async function CreatePolicy(policyName, type) {
  let apiConfig = {
    headers: GetHeaders(),
  };

  const url = `${dssEndpoint}/deploymentAudiences`;
  let res = await axios
    .post(url, {}, apiConfig)
    .catch((err) => {
      console.log("Error creating audience : " + err);
      notify("Error creating audience: " + err, "error");
      return false;
    })
    .finally(() => {
      console.log("Toaster should send");
      notify("Policy created succefully.", "success");
      return true;
    });

  let audienceId = res.data.id;
  const policyId = await createPolicyWithAudienceID(
    policyName,
    audienceId,
    type
  );

  return { audienceId, policyId };
}

// POST: create policy api
async function createPolicyWithAudienceID(policyName, audienceId, type) {
  let apiConfig = {
    headers: GetHeaders(),
  };

  const url = `${dssEndpoint}/updatePolicies`;
  let body = {
    audience: {
      id: audienceId,
    },
    autoEnrollmentUpdateCategories: ["driver"],
  };
  if (type === "automatic") {
    body["complianceChangeRules"] = [
      {
        "@odata.type": entityType + ".contentApprovalRule",
        contentFilter: {
          "@odata.type": entityType + ".driverUpdateFilter",
        },
      },
    ];

    body["deploymentSettings"] = {
      "@odata.type": entityType + ".deploymentSettings",
      contentApplicability: {
        "@odata.type": entityType + ".contentApplicabilitySettings",
        offerWhileRecommendedBy: ["microsoft"],
      },
    };
  }

  let res = await axios.post(url, body, apiConfig).catch((err) => {
    console.log("Error creating policy : " + err);
    return null;
  });

  let policyId = res.data.id;
  localStorage.setItem(policyId, policyName);
  return policyId;
}
