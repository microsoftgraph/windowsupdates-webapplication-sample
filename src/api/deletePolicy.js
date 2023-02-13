import { dssEndpoint } from "../config/Constants";
import { GetHeaders } from "../utils/fetchHelper";
import { toast } from "react-toastify";
import axios from "axios";
import { notify } from "../utils/notify";

// Delete Policy based on the PolicyID
export async function deletePolicy(policyId) {
  console.log("Delete policyId: " + policyId);
  await axios
    .delete(`${dssEndpoint}/updatePolicies('${policyId}')`, {
      headers: GetHeaders(),
    })
    .then((res) => {
      notify("Policy Deleted Successfully", "success");
    })
    .catch((err) => {
      console.log(err);
      notify("Policy failed to delete with error: " + err, "error");
    });
}
