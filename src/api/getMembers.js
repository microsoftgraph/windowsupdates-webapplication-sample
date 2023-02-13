import axios from "axios";
import { dssEndpoint } from "../config/Constants";
import { GetHeaders } from "../utils/fetchHelper";

// GET: members using Audience ID using api call
export async function getMembersFromAudienceId(audienceId) {
  if (!audienceId) {
    return [];
  } else {
    let apiConfig = {
      headers: GetHeaders(),
    };
    const url = `${dssEndpoint}/deploymentAudiences('${audienceId}')/members`;
    try {
      let res = await axios.get(url, apiConfig);
      if (res.status === 200) {
        return res.data.value;
      } else {
        console.log("Failed to get successfully members call");
        console.log(res.status);
        return [];
      }
    } catch (err) {
      console.log(
        "Error fetching members for audience : " + audienceId + " " + err
      );
      return [];
    }
  }
}
