import axios from "axios";
import { dssEndpoint } from "../config/Constants";
import { GetHeaders } from "../utils/fetchHelper";
import { notify } from "../utils/notify";

// POST: Update Audience for adding members or removing
export async function updateDeploymentAudience(requestBody, audienceId) {
  let apiConfig = {
    headers: GetHeaders(),
  };
  const url = `${dssEndpoint}/deploymentAudiences('${audienceId}')/updateAudience`;
  try {
    let res = await axios.post(url, requestBody, apiConfig);
    notify("Deployment audience updated successfully.", "success");
    return res;
  } catch (err) {
    notify(
      "Failed to update deployment audience with error: " +
        err?.response?.data?.error?.message,
      "error"
    );
    return err;
  }
}
