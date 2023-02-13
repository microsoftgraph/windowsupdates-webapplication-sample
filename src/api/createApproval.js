import axios from "axios";
import { notify } from "../utils/notify";
import { dssEndpoint, entityType } from "../config/Constants";
import { GetHeaders } from "../utils/fetchHelper";

// Post CreateApporval API
export async function createApproval(
  startDate,
  isRecommendedUpdate,
  id,
  policyId
) {
  // URL to submit the POST request
  const url = `${dssEndpoint}/updatePolicies('${policyId}')/complianceChanges`;

  let body = {
    "@odata.type": entityType + ".contentApproval",
    deploymentSettings: {
      "@odata.type": entityType + ".deploymentSettings",
      schedule: {
        startDateTime: startDate.toISOString(),
      },
    },
    content: {
      "@odata.type": entityType + ".catalogContent",
      catalogEntry: {
        "@odata.type": entityType + ".driverUpdateCatalogEntry",
        id: id,
      },
    },
  };

  let apiConfig = {
    headers: GetHeaders(),
  };

  if (isRecommendedUpdate) {
    body.deploymentSettings["contentApplicability"] = {
      "@odata.type": entityType + ".contentApplicabilitySettings",
      offerWhileRecommendedBy: ["microsoft"],
    };
  }
  try {
    await axios.post(url, body, apiConfig).then(() => {
      console.log("Crated approval for the given content");
      notify("Content Approved!", "success");
      return true;
    });
  } catch (ex) {
    console.log("Failed to create approval " + ex);
    notify("Failed to approve content : " + ex, "error");
    return false;
  }
}
