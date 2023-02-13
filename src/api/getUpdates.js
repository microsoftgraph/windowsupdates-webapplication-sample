import { GetHeaders } from "../utils/fetchHelper";
import { dssEndpoint } from "../config/Constants";
import axios from "axios";

// helper function to extract the start date time
function extractStartDateTime(complianceChange) {
  let depSettings = complianceChange.deploymentSettings;
  if (
    depSettings != null &&
    depSettings.schedule != null &&
    depSettings.schedule.startDateTime != null
  ) {
    return new Date(depSettings.schedule.startDateTime);
  } else {
    return null;
  }
}

// get Updates based on the policyid
export async function getUpdates(policyId) {
  let localCatalogIdToApprovals = {};
  let localCatalogIdToRevokedContentApproval = {};
  let localCatalogIdToApprovedContentApproval = {};
  const categoryValues = [];
  try {
    const expandAudienceResponse = await axios.get(
      `${dssEndpoint}/updatePolicies('${policyId}')?$expand=audience`,
      { headers: GetHeaders() }
    );
    if (!expandAudienceResponse?.data?.audience?.id) {
      console.log("No audience defined, thus no updates.");
      return null;
    }
    const catalogEntryResponse = await axios.get(
      `${dssEndpoint}/deploymentAudiences('${expandAudienceResponse.data.audience.id}')/applicableContent?$expand=catalogEntry`,
      { headers: GetHeaders() }
    );

    // this call is required to get suspend and approval data
    const complianceChangesResponse = await axios.get(
      `${dssEndpoint}/updatePolicies('${policyId}')/complianceChanges`,
      { headers: GetHeaders() }
    );

    // Need to find latest compliance change from the all apporvals
    for (let complianceChange of complianceChangesResponse.data.value) {
      let contentId = complianceChange.content.catalogEntry.id;
      if (complianceChange.isRevoked) {
        if (contentId in localCatalogIdToRevokedContentApproval) {
          let currRevokedDateTime = new Date(complianceChange.revokedDateTime);
          let otherRevokedDateTime = new Date(
            localCatalogIdToRevokedContentApproval[contentId].revokedDateTime
          );
          if (currRevokedDateTime > otherRevokedDateTime) {
            localCatalogIdToRevokedContentApproval[contentId] =
              complianceChange;
          }
        } else {
          localCatalogIdToRevokedContentApproval[contentId] = complianceChange;
        }
      } else {
        // Setup all approvals associated with a contentId in case of revoke.
        if (contentId in localCatalogIdToApprovals) {
          localCatalogIdToApprovals[contentId].push(complianceChange);
        } else {
          localCatalogIdToApprovals[contentId] = [complianceChange];
        }

        if (contentId in localCatalogIdToApprovedContentApproval) {
          let currStartDateTime = extractStartDateTime(complianceChange);
          let otherStartDateTime = extractStartDateTime(
            localCatalogIdToApprovedContentApproval[contentId]
          );
          if (
            otherStartDateTime != null &&
            (currStartDateTime == null ||
              currStartDateTime < otherStartDateTime)
          ) {
            localCatalogIdToApprovedContentApproval[contentId] =
              complianceChange;
          }
        } else {
          localCatalogIdToApprovedContentApproval[contentId] = complianceChange;
        }
      }
    }
    for (let i = 0; i < catalogEntryResponse.data.value.length; i++) {
      let driverUpdate = catalogEntryResponse.data.value[i];
      let catEntryId = driverUpdate.catalogEntry.id;
      if (catEntryId in localCatalogIdToApprovedContentApproval) {
        let approvalDate = extractStartDateTime(
          localCatalogIdToApprovedContentApproval[catEntryId]
        );
        driverUpdate.approvalDate =
          approvalDate != null ? approvalDate.toDateString() : "Immediate";
        driverUpdate.suspensionDate = "";
      } else if (catEntryId in localCatalogIdToRevokedContentApproval) {
        driverUpdate.suspensionDate = new Date(
          localCatalogIdToRevokedContentApproval[catEntryId].revokedDateTime
        ).toDateString();
        driverUpdate.approvalDate = "";
      }
      categoryValues.push(driverUpdate);
    }

    return {
      catalogIdToApprovals: localCatalogIdToApprovals,
      catalogIdToRevokedContentApproval: localCatalogIdToRevokedContentApproval,
      catalogIdToApprovedContentApproval:
        localCatalogIdToApprovedContentApproval,
      categoryValues: categoryValues,
      isAutomatic:
        expandAudienceResponse.data.complianceChangeRules.length !== 0,
    };

    // return catalogEntryResponse.data.value;
  } catch (e) {
    handleError(e);
  }
}

let handleError = (error) => {
  console.log(error);
};
