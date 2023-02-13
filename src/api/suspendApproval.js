import axios from "axios";
import { dssEndpoint, entityType } from "../config/Constants";
import { notify } from "../utils/notify";
import { GetHeaders } from "../utils/fetchHelper";

// Suspend Apporval based on the compliancechanges id and policyId
export async function suspendApproval(id, policyId) {
  const url = `${dssEndpoint}/updatePolicies('${policyId}')/complianceChanges('${id}')`;
  const patchBody = JSON.stringify({
    "@odata.type": entityType + ".contentApproval",
    isRevoked: true,
  });

  let apiConfig = {
    headers: GetHeaders(),
  };
  try {
    await axios.patch(url, patchBody, apiConfig).then(() => {
      console.log("Successfully suspended approval ");
      notify("Approval Suspended Successfully", "success");
    });
  } catch (ex) {
    notify("Failed to suspend the approval with error " + ex, "error");
  }
}
