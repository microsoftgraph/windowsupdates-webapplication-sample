import axios from "axios";
import { dssEndpoint, UPDATE_POLICIES_ENDPOINT } from "../config/Constants";
import { GetHeaders } from "../utils/fetchHelper";

// GET: All Policies based on the tenant ID
export async function getPolicies() {
  try {
    let apiConfig = {
      headers: GetHeaders(), // Attach the Tenant Id in the Header for retriving policies
    };
    const result = await axios.get(
      dssEndpoint + UPDATE_POLICIES_ENDPOINT,
      apiConfig
    );
    return result.data.value;
  } catch (err) {
    console.log(err);
    return false;
  }
}
