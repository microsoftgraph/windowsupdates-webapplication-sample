import { useEffect, useState } from "react";
import { getUpdates } from "../api/getUpdates";

export function useUpdateData(id) {
  const [updatesInfoData, setUpdatesInfoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutomaticPolicy, setIsAutomaticPolicy] = useState(false);
  const [catalogIdToApprovals, setCatalogIdToApprovals] = useState({});
  const [
    catalogIdToRevokedContentApproval,
    setCatalogIdToRevokedContentApproval,
  ] = useState({});
  const [
    catalogIdToApprovedContentApproval,
    setCatalogIdToApprovedContentApproval,
  ] = useState({});

  async function refreshUpdatesData() {
    setIsLoading(true);
    const updates = await getUpdates(id);
    setIsAutomaticPolicy(updates?.isAutomatic);
    setCatalogIdToApprovals(updates?.catalogIdToApprovals);
    setCatalogIdToApprovedContentApproval(
      updates?.catalogIdToApprovedContentApproval
    );
    setCatalogIdToRevokedContentApproval(
      updates?.catalogIdToRevokedContentApproval
    );
    let updatesInfoData = [];
    for (let update of updates.categoryValues) {
      let updateInfo = {
        updateName: update.catalogEntry.displayName,
        releaseDateTime: new Date(
          update.catalogEntry.releaseDateTime
        ).toDateString(),
        applicableDeviceCount: update.matchedDevices.length,
        driverClass: update.catalogEntry.driverClass,
        approvalDate: update.approvalDate ?? "-",
        suspensionDate: update.suspensionDate ?? "-",
        description: update.catalogEntry.description,
        manufacturer: update.catalogEntry.manufacturer,
        matchedDevices: update.matchedDevices,
        catalogEntryId: update.catalogEntry.id,
      };
      updatesInfoData.push(updateInfo);
    }
    setUpdatesInfoData(updatesInfoData);
    setIsLoading(false);
  }

  useEffect(() => {
    async function fetchUpdateData() {
      setIsLoading(true);
      const updates = await getUpdates(id);
      setIsAutomaticPolicy(updates?.isAutomatic);
      setCatalogIdToApprovals(updates?.catalogIdToApprovals);
      setCatalogIdToApprovedContentApproval(
        updates?.catalogIdToApprovedContentApproval
      );
      setCatalogIdToRevokedContentApproval(
        updates?.catalogIdToRevokedContentApproval
      );
      let updatesInfoData = [];
      if (updates != null) {
        for (let update of updates.categoryValues) {
          let updateInfo = {
            updateName: update.catalogEntry.displayName,
            releaseDateTime: new Date(
              update.catalogEntry.releaseDateTime
            ).toDateString(),
            applicableDeviceCount: update.matchedDevices.length,
            driverClass: update.catalogEntry.driverClass,
            approvalDate: update.approvalDate ?? "-",
            suspensionDate: update.suspensionDate ?? "-",
            description: update.catalogEntry.description,
            manufacturer: update.catalogEntry.manufacturer,
            matchedDevices: update.matchedDevices,
            catalogEntryId: update.catalogEntry.id,
          };
          updatesInfoData.push(updateInfo);
        }
      }
      setUpdatesInfoData(updatesInfoData);
      setIsLoading(false);
    }

    fetchUpdateData();
  }, []);

  return [
    updatesInfoData,
    isAutomaticPolicy,
    catalogIdToApprovals,
    catalogIdToRevokedContentApproval,
    catalogIdToApprovedContentApproval,
    isLoading,
    refreshUpdatesData,
  ];
}
